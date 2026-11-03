import { AccentBand, CtaBand } from '../components/sections/Bands';
import { ExperienceList } from '../components/sections/ExperienceList';
import { HomeHero } from '../components/sections/HomeHero';
import { TestimonialGrid } from '../components/sections/PeopleLists';
import { ServiceStrip } from '../components/sections/ServiceStrip';
import { SkillsCloud } from '../components/sections/SkillsGrid';
import { WorkGrid } from '../components/sections/WorkGrid';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { SectionHeading } from '../components/ui/SectionHeading';
import { useExperience, useProjects, useSkills, useTestimonials } from '../hooks/useContent';
import { usePageTitle } from '../hooks/usePageTitle';

// One page with a summary of everything; each part links to its own page for the full story.
const Home = () => {
  usePageTitle();
  const { items: projects } = useProjects();
  const { items: experience } = useExperience();
  const { items: skills } = useSkills();
  const { items: testimonials } = useTestimonials();

  const featured = projects.filter((p) => p.featured);
  const selected = (featured.length >= 3 ? featured : projects).slice(0, 3);

  return (
    <>
      <HomeHero />
      <ServiceStrip />

      {selected.length > 0 && (
        <section>
          <Container className="grid gap-12 py-20 md:py-28">
            <SectionHeading
              label="Selected work"
              title="Things I've built."
              lead="Full stack products, from the database to the screen people use."
              action={
                <Button to="/work" variant="ghost">
                  All projects
                </Button>
              }
            />
            <WorkGrid items={selected} />
          </Container>
        </section>
      )}

      {skills.length > 0 && (
        <section className="border-t border-line">
          <Container className="grid justify-items-center gap-6 py-20 text-center md:py-28">
            <h2 className="max-w-[20ch] text-[clamp(1.9rem,4.4vw,3rem)] leading-[1.08]">
              Front end, back end, and everything between
              <span
                aria-hidden="true"
                className="ml-1 inline-block h-[0.85em] w-[0.18em] translate-y-[0.1em] animate-pulse bg-tangerine-500 motion-reduce:animate-none"
              />
            </h2>
            <p className="max-w-[48ch] text-fg-soft">The tools I reach for most.</p>
            <div className="mt-4 grid justify-items-center">
              <SkillsCloud items={skills} />
            </div>
          </Container>
        </section>
      )}

      {experience.length > 0 && (
        <section className="border-t border-line">
          <Container className="grid gap-12 py-20 md:py-28">
            <SectionHeading
              label="Experience"
              title="Where I've worked."
              action={
                <Button to="/about" variant="ghost">
                  Full background
                </Button>
              }
            />
            <ExperienceList items={experience.slice(0, 3)} />
          </Container>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="border-t border-line">
          <Container className="grid gap-12 py-20 md:py-28">
            <SectionHeading label="Kind words" title="What people say." />
            <TestimonialGrid items={testimonials.slice(0, 2)} />
          </Container>
        </section>
      )}

      <AccentBand />
      <CtaBand />
    </>
  );
};

export default Home;
