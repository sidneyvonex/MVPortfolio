import { useParams } from 'react-router';
import { CtaBand } from '../components/sections/Bands';
import { PageHeader } from '../components/sections/PageHeader';
import { ProjectCover, WorkGrid } from '../components/sections/WorkGrid';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Label } from '../components/ui/Label';
import { useProjects } from '../hooks/useContent';
import { usePageTitle } from '../hooks/usePageTitle';
import { paragraphs, projectSummary } from '../lib/format';
import NotFound from './NotFound';

/** A project's own page. Found by slug, or by id for projects saved before slugs existed. */
const CaseStudy = () => {
  const { slug } = useParams();
  const { items: projects, isLoading } = useProjects();
  const index = projects.findIndex((p) => p.slug === slug || String(p.projectId) === slug);
  const project = projects[index];
  usePageTitle(project?.title);

  if (isLoading) return <Container className="py-28 text-fg-soft">Loading…</Container>;
  if (!project) return <NotFound />;

  // The next two projects, wrapping around, so every page leads somewhere.
  const more = [1, 2]
    .map((n) => projects[(index + n) % projects.length])
    .filter((p) => p && p.projectId !== project.projectId);

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Work', to: '/work' }, { label: project.title }]}
        title={project.title}
        lead={projectSummary(project)}
      >
        <div className="flex flex-wrap gap-3">
          {project.liveUrl && (
            <Button href={project.liveUrl} external>
              Visit the live site
            </Button>
          )}
          {project.githubUrl && (
            <Button href={project.githubUrl} variant="ghost" external>
              Source on GitHub
            </Button>
          )}
        </div>
      </PageHeader>

      <section>
        <Container className="grid gap-14 py-16 md:py-24">
          <ProjectCover project={project} width={1600} natural />

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
            <div className="grid content-start gap-5">
              <Label dot className="text-fg-soft">
                About the project
              </Label>
              {paragraphs(project.description).map((p) => (
                <p key={p} className="max-w-[65ch] text-lg leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
            <aside className="grid content-start gap-4 border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              <Label className="text-fg-soft">Built with</Label>
              <ul className="flex flex-wrap gap-2">
                {project.techStack.map((t) => (
                  <li key={t} className="border border-line px-3 py-1.5 text-sm">
                    {t}
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <div>
            <Button to="/work" variant="ghost">
              Back to all work
            </Button>
          </div>
        </Container>
      </section>

      {more.length > 0 && (
        <section className="border-t border-line">
          <Container className="grid gap-10 py-20 md:py-24">
            <Label dot className="text-fg-soft">
              More work
            </Label>
            <WorkGrid items={more} />
          </Container>
        </section>
      )}

      <CtaBand title="Want something like this built?" />
    </>
  );
};

export default CaseStudy;
