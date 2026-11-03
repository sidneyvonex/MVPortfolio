import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../services/api';
import { Button } from '../ui/Button';
import { Label } from '../ui/Label';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactValues = z.infer<typeof contactSchema>;

const field =
  'w-full border border-line bg-surface px-4 py-3 text-fg placeholder:text-fg-soft/70 transition-colors focus:border-fg focus:outline-none';

/** Message form posting to the API; the message lands in the admin dashboard. */
export const ContactForm = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactValues) => {
    setStatus('sending');
    try {
      await api.contact.send(data);
      setStatus('sent');
      reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div role="status" className="grid content-start gap-4 border border-line bg-surface-2 p-8">
        <Label dot className="text-fg">
          Message sent
        </Label>
        <p className="text-xl leading-snug tracking-[-0.01em]">
          Thanks, I've got it. I'll reply by email.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="justify-self-start text-[0.9375rem] font-medium underline decoration-tangerine-500 underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
      {(
        [
          { name: 'name', label: 'Your name', type: 'text', autoComplete: 'name' },
          { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
        ] as const
      ).map((f) => (
        <div key={f.name} className="grid gap-2">
          <label htmlFor={f.name}>
            <Label className="text-fg-soft">{f.label}</Label>
          </label>
          <input
            id={f.name}
            type={f.type}
            autoComplete={f.autoComplete}
            aria-invalid={!!errors[f.name]}
            className={field}
            {...register(f.name)}
          />
          {errors[f.name] && <p className="text-sm text-accent">{errors[f.name]?.message}</p>}
        </div>
      ))}
      <div className="grid gap-2">
        <label htmlFor="message">
          <Label className="text-fg-soft">What are you building?</Label>
        </label>
        <textarea
          id="message"
          rows={6}
          aria-invalid={!!errors.message}
          placeholder="A project, a hackathon team, a sprint… and roughly when."
          className={`${field} resize-y`}
          {...register('message')}
        />
        {errors.message && <p className="text-sm text-accent">{errors.message.message}</p>}
      </div>
      {status === 'error' && (
        <p role="alert" className="border border-line bg-accent-soft px-4 py-3 text-[0.9375rem]">
          The message didn't send. Please try again, or email me directly.
        </p>
      )}
      <div>
        <Button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </Button>
      </div>
    </form>
  );
};
