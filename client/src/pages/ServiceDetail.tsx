import { Link, useParams } from 'react-router';
import { AccentBand, CtaBand } from '../components/sections/Bands';
import { ProcessSteps } from '../components/sections/Lists';
import { PageHeader } from '../components/sections/PageHeader';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Label } from '../components/ui/Label';
import { SectionHeading } from '../components/ui/SectionHeading';
import { TileBullet } from '../components/ui/TileBullet';
import { TileIcon } from '../components/ui/TileIcon';
import { SERVICE_GROUPS, SERVICES, servicesIn } from '../data/services';
import { usePageTitle } from '../hooks/usePageTitle';
import NotFound from './NotFound';

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = SERVICES.find((s) => s.slug === slug);
  usePageTitle(service?.title);
  if (!service) return <NotFound />;

  const group = SERVICE_GROUPS[service.group];
  const others = servicesIn(service.group).filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Services', to: '/services' }, { label: service.title }]}
        title={service.title}
        lead={service.intro}
        aside={
          <div className="grid aspect-square w-full max-w-[20rem] place-items-center justify-self-center border border-line bg-surface-2 lg:justify-self-end">
            <TileIcon name={service.icon} size={128} className="text-fg" />
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Button to="/contact">Talk about your {service.group === 'build' ? 'project' : 'team'}</Button>
          <Button to="/work" variant="ghost">
            See my work
          </Button>
        </div>
      </PageHeader>

      <section>
        <Container className="grid py-20 md:py-24 lg:grid-cols-2 lg:gap-16">
          <div className="grid content-start gap-6">
            <Label dot className="text-fg-soft">
              What's included
            </Label>
            <ul className="grid border-t border-line">
              {service.includes.map((item) => (
                <li key={item} className="flex gap-3 border-b border-line py-4">
                  <TileBullet />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid content-start gap-6 pt-12 lg:pt-0">
            <Label dot className="text-fg-soft">
              Who it's for
            </Label>
            <p className="text-[clamp(1.3rem,2.4vw,1.75rem)] leading-snug tracking-[-0.02em]">
              {service.forWho}
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-line">
        <Container className="grid gap-12 py-20 md:py-24">
          <SectionHeading label="How it runs" title="Step by step." />
          <ProcessSteps steps={service.steps} />
        </Container>
      </section>

      <AccentBand />

      <section className="border-b border-line">
        <Container className="grid gap-8 py-20 md:py-24">
          <SectionHeading label={group.label} title="Also on offer." />
          <ul className="grid gap-px border border-line bg-line md:grid-cols-3">
            {others.map((s) => (
              <li key={s.slug} className="bg-surface">
                <Link
                  to={`/services/${s.slug}`}
                  className="group grid h-full content-start gap-3 p-6 transition-colors hover:bg-surface-2"
                >
                  <TileIcon name={s.icon} size={28} className="text-fg" />
                  <span className="text-lg font-medium tracking-[-0.01em]">{s.title}</span>
                  <span className="text-[0.9375rem] text-fg-soft">{s.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand title={`Need help with ${service.title.toLowerCase()}?`} />
    </>
  );
};

export default ServiceDetail;
