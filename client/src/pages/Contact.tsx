import { ContactForm } from '../components/sections/ContactForm';
import { PageHeader } from '../components/sections/PageHeader';
import { Container } from '../components/ui/Container';
import { Label } from '../components/ui/Label';
import { SITE } from '../data/site';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSettings } from '../hooks/useSettings';

const Contact = () => {
  usePageTitle('Contact');
  const { settings, email, socials, resumeHref } = useSettings();

  const details = [
    { label: 'Email', value: email, href: `mailto:${email}` },
    ...(settings?.phone
      ? [{ label: 'Phone', value: settings.phone, href: `tel:${settings.phone.replace(/\s+/g, '')}` }]
      : []),
    { label: 'Based in', value: settings?.location || SITE.location },
  ];

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Contact' }]}
        title="Let's build something."
        lead="A project, a team that needs a hand, a hackathon or a sprint: tell me about it and I'll get back to you."
      />
      <section>
        <Container className="grid gap-16 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="grid content-start gap-10">
            <dl className="grid border-t border-line">
              {details.map((d) => (
                <div key={d.label} className="grid gap-1 border-b border-line py-4">
                  <dt>
                    <Label className="text-fg-soft">{d.label}</Label>
                  </dt>
                  <dd className="text-lg font-medium tracking-[-0.01em] break-all">
                    {d.href ? (
                      <a href={d.href} className="hover:text-accent">
                        {d.value}
                      </a>
                    ) : (
                      d.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="grid gap-4">
              <Label dot className="text-fg-soft">
                Elsewhere
              </Label>
              <ul className="flex flex-wrap gap-2">
                {[...socials.filter((s) => !s.href.startsWith('mailto:')), ...(resumeHref ? [{ label: 'Résumé', href: resumeHref }] : [])].map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex border border-line px-3 py-1.5 text-sm transition-colors hover:border-fg"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ContactForm />
        </Container>
      </section>
    </>
  );
};

export default Contact;
