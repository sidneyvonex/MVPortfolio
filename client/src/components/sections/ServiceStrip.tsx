import { Link } from 'react-router';
import { SERVICE_GROUPS, servicesIn, type ServiceGroup } from '../../data/services';
import { Container } from '../ui/Container';
import { Label } from '../ui/Label';
import { TileIcon } from '../ui/TileIcon';

/** One row of icon cells per service group, full width with hairline borders. */
export const ServiceStrip = () => (
  <section aria-label="Services">
    {(['build', 'collaborate'] as ServiceGroup[]).map((group) => (
      <div key={group} className="border-b border-line">
        <Container className="px-0 md:px-0">
          <div className="border-b border-line px-5 py-3 md:px-8">
            <Label dot className="text-fg-soft">
              {SERVICE_GROUPS[group].label}
            </Label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {servicesIn(group).map((s, i) => (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                className={`flex flex-col items-center gap-4 border-line px-4 py-9 text-center transition-colors hover:bg-surface-2 ${
                  i % 2 === 1 ? 'border-l' : ''
                } ${i > 1 ? 'border-t md:border-t-0' : ''} ${i === 2 ? 'md:border-l' : ''}`}
              >
                <TileIcon name={s.icon} size={32} className="text-fg" />
                <span className="text-[0.9375rem] font-medium">{s.title}</span>
              </Link>
            ))}
          </div>
        </Container>
      </div>
    ))}
  </section>
);
