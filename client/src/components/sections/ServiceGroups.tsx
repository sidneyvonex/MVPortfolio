import { Link } from 'react-router';
import { SERVICE_GROUPS, servicesIn, type ServiceGroup } from '../../data/services';
import { Container } from '../ui/Container';
import { TileIcon } from '../ui/TileIcon';
import { SectionHeading } from '../ui/SectionHeading';

/** Both service groups, each a heading and a hairline grid of cards linking to the service pages. */
export const ServiceGroups = () => (
  <>
    {(['build', 'collaborate'] as ServiceGroup[]).map((group) => (
      <section key={group} id={group} className="scroll-mt-16 border-b border-line">
        <Container className="grid gap-10 py-20 md:py-24">
          <SectionHeading
            label={SERVICE_GROUPS[group].label}
            title={SERVICE_GROUPS[group].title}
            lead={SERVICE_GROUPS[group].lead}
          />
          <ul className="grid gap-px border border-line bg-line md:grid-cols-2">
            {servicesIn(group).map((s) => (
              <li key={s.slug} className="bg-surface">
                <Link
                  to={`/services/${s.slug}`}
                  className="group grid h-full content-start gap-4 p-6 transition-colors hover:bg-surface-2 md:p-8"
                >
                  <TileIcon name={s.icon} size={36} className="text-fg" />
                  <h3 className="text-[clamp(1.3rem,2.2vw,1.6rem)] leading-[1.1]">{s.title}</h3>
                  <p className="text-[0.9375rem] leading-relaxed text-fg-soft">{s.summary}</p>
                  <span className="inline-flex items-center gap-2 text-[0.9375rem] font-medium">
                    More about {s.title.toLowerCase()}
                    <TileIcon
                      name="arrow-right"
                      size={11}
                      accent="currentColor"
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    ))}
  </>
);
