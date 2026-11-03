import { CtaBand } from '../components/sections/Bands';
import { PageHeader } from '../components/sections/PageHeader';
import { ServiceGroups } from '../components/sections/ServiceGroups';
import { Button } from '../components/ui/Button';
import { usePageTitle } from '../hooks/usePageTitle';

const Services = () => {
  usePageTitle('Services');

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Services' }]}
        title="What I can do for you, and with you."
        lead="I build products for clients from idea to launch, and join other developers on projects, hackathons, sprints and short contracts."
      >
        <div className="flex flex-wrap gap-3">
          <Button href="#build">Build for you</Button>
          <Button href="#collaborate" variant="ghost">
            Build with you
          </Button>
        </div>
      </PageHeader>
      <ServiceGroups />
      <CtaBand title="Not sure which fits?" />
    </>
  );
};

export default Services;
