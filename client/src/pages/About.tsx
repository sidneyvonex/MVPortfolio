import { CtaBand } from '../components/sections/Bands';
import { EducationList, ExperienceList } from '../components/sections/ExperienceList';
import { PageHeader } from '../components/sections/PageHeader';
import { CommunityList, TestimonialGrid } from '../components/sections/PeopleLists';
import { SkillsGrid } from '../components/sections/SkillsGrid';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Label } from '../components/ui/Label';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SITE } from '../data/site';
import { useCommunity, useEducation, useExperience, useSkills, useTestimonials } from '../hooks/useContent';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSettings } from '../hooks/useSettings';
import { imageUrl, paragraphs } from '../lib/format';

// Used until a bio is written in the admin dashboard (Settings → About bio).
const DEFAULT_BIO =
  'Full stack software engineer building and deploying production web applications with TypeScript, React, Next.js, Node.js and PostgreSQL.\n\nI care about the whole path: how the data is modelled, how the API behaves, and how the screen feels to the person using it. I am studying for a BSc in Software Engineering at the University of Eastern Africa, Baraton.';

const About = () => {
  usePageTitle('About');
  const { settings, resumeHref } = useSettings();
  const { items: experience } = useExperience();
  const { items: education } = useEducation();
  const { items: skills } = useSkills();
  const { items: community } = useCommunity();
  const { items: testimonials } = useTestimonials();

  const facts = [
    { label: 'Based in', value: settings?.location || SITE.location },
    { label: 'Focus', value: 'Full stack web and mobile' },
    { label: 'Open to', value: 'Projects, teams, hackathons' },
  ];

  const section = (label: string, title: string, children: React.ReactNode) => (
    <section className="border-b border-line">
      <Container className="grid gap-10 py-20 md:py-24">
        <SectionHeading label={label} title={title} />
        {children}
      </Container>
    </section>
  );

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'About' }]}
        title={`Hi, I'm ${SITE.name.split(' ')[0]}.`}
        lead="A full stack developer who likes building useful things, for clients and with other developers."
        aside={
          settings?.heroImageUrl ? (
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[22rem] overflow-hidden border border-line bg-surface-2 lg:mr-0">
              <img
                src={imageUrl(settings.heroImageUrl, 700)}
                alt={`Portrait of ${SITE.name}`}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: settings.heroFocalPoint || '50% 30%' }}
              />
            </div>
          ) : undefined
        }
      >
        <div className="flex flex-wrap gap-3">
          {resumeHref && (
            <Button href={resumeHref} download>
              Download my CV
            </Button>
          )}
          <Button to="/contact" variant="ghost">
            Get in touch
          </Button>
        </div>
      </PageHeader>

      <section className="border-b border-line">
        <Container className="grid gap-12 py-20 md:py-24 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <div className="grid content-start gap-5">
            <Label dot className="text-fg-soft">
              My story
            </Label>
            {paragraphs(settings?.aboutBio || DEFAULT_BIO).map((p) => (
              <p key={p} className="max-w-[60ch] text-lg leading-relaxed">
                {p}
              </p>
            ))}
          </div>
          <dl className="grid content-start border-t border-line">
            {facts.map((f) => (
              <div key={f.label} className="grid gap-1 border-b border-line py-4">
                <dt>
                  <Label className="text-fg-soft">{f.label}</Label>
                </dt>
                <dd className="text-lg font-medium tracking-[-0.01em]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {experience.length > 0 && section('Experience', 'Where I have worked.', <ExperienceList items={experience} detailed />)}
      {skills.length > 0 && section('Skills', 'What I work with.', <SkillsGrid items={skills} />)}
      {education.length > 0 && section('Education', 'Where I studied.', <EducationList items={education} />)}
      {community.length > 0 && section('Community', 'Where I give back.', <CommunityList items={community} />)}
      {testimonials.length > 0 && section('Kind words', 'What people say.', <TestimonialGrid items={testimonials} />)}

      <CtaBand />
    </>
  );
};

export default About;
