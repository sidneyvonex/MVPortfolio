import { PageHeader } from '../components/sections/PageHeader';
import { Container } from '../components/ui/Container';
import { SITE } from '../data/site';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSettings } from '../hooks/useSettings';

const Privacy = () => {
  usePageTitle('Privacy');
  const { email } = useSettings();

  const sections = [
    {
      title: 'What I collect',
      body: 'When you send a message through the contact form, I receive your name, your email address and your message. Nothing else is collected through the form.',
    },
    {
      title: 'What I use it for',
      body: 'Only to read and reply to your message. I do not add you to a mailing list, and I do not sell or share your details.',
    },
    {
      title: 'Where it is stored',
      body: 'Messages are stored in the database behind this site so I can read them. The site and its database run on Cloudflare and Neon.',
    },
    {
      title: 'Your choices',
      body: `To see or delete what you sent, email ${email} and I will take care of it.`,
    },
    {
      title: 'Preferences',
      body: 'If you switch between light and dark mode, the choice is saved in your browser so the site remembers it. It is never sent to me.',
    },
  ];

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Privacy' }]}
        title="Privacy."
        lead={`How ${SITE.name}'s site handles what you share. Short, because it collects very little.`}
      />
      <section>
        <Container className="grid max-w-[52rem] gap-10 py-16 md:py-24">
          {sections.map((s) => (
            <div key={s.title} className="grid gap-3 border-t border-line pt-6">
              <h2 className="text-2xl tracking-[-0.02em]">{s.title}</h2>
              <p className="text-lg leading-relaxed text-fg-soft">{s.body}</p>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
};

export default Privacy;
