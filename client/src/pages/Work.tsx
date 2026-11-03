import { useState } from 'react';
import { CtaBand } from '../components/sections/Bands';
import { PageHeader } from '../components/sections/PageHeader';
import { WorkGrid } from '../components/sections/WorkGrid';
import { Container } from '../components/ui/Container';
import { FilterChips } from '../components/ui/FilterChips';
import { useProjects } from '../hooks/useContent';
import { usePageTitle } from '../hooks/usePageTitle';

const ALL = 'all';
const MAX_FILTERS = 6;

const Work = () => {
  usePageTitle('Work');
  const { items: projects, isLoading } = useProjects();
  const [active, setActive] = useState(ALL);

  // The technologies used in the most projects become the filters.
  const counts = new Map<string, number>();
  for (const p of projects) for (const t of p.techStack) counts.set(t, (counts.get(t) ?? 0) + 1);
  const top = [...counts].sort((a, b) => b[1] - a[1]).slice(0, MAX_FILTERS);
  const options = [
    { value: ALL, label: 'All', count: projects.length },
    ...top.map(([tech, count]) => ({ value: tech, label: tech, count })),
  ];
  const shown = active === ALL ? projects : projects.filter((p) => p.techStack.includes(active));

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Work' }]}
        title="Projects I've built."
        lead="Each one built end to end: database, API and the interface people use. Open one for the full story."
      />
      <section>
        <Container className="grid gap-12 py-16 md:py-20">
          {projects.length > 1 && (
            <FilterChips
              label="Filter by technology"
              options={options}
              active={active}
              onChange={setActive}
              total={shown.length}
            />
          )}
          {isLoading ? (
            <p className="text-fg-soft">Loading projects…</p>
          ) : (
            <WorkGrid items={shown} />
          )}
        </Container>
      </section>
      <CtaBand title="Have a project like these?" />
    </>
  );
};

export default Work;
