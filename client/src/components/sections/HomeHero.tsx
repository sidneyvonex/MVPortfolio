import { SITE } from '../../data/site';
import { useSettings } from '../../hooks/useSettings';
import { imageUrl } from '../../lib/format';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { Label } from '../ui/Label';
import { HeroTiles } from './HeroTiles';

/** Home hero: who I am and what I do on the left, the portrait on a paper panel on the right. */
export const HomeHero = () => {
  const { settings } = useSettings();
  const photo = settings?.heroImageUrl;

  return (
    <section className="relative overflow-hidden border-b border-line">
      <HeroTiles />
      <Container className="relative grid items-end gap-12 pt-16 pb-36 md:pt-24 md:pb-48 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
        <div className="grid content-center gap-7 self-center">
          <h1 className="max-w-[15ch] text-[clamp(2.6rem,6.2vw,5.25rem)] leading-[1.02] tracking-[-0.04em]">
            I build software people use.
          </h1>
          <p className="max-w-[46ch] text-lg leading-normal text-fg-soft md:text-xl">
            {settings?.tagline ||
              `I'm ${SITE.name}, a full stack developer. Websites, web apps and mobile apps for clients, and an extra pair of hands for teams, hackathons and sprints.`}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button to="/work">See my work</Button>
            <Button to="/contact" variant="ghost">
              Get in touch
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[26rem] lg:mx-0 lg:justify-self-end">
          <div className="relative aspect-[4/5] overflow-hidden border border-line bg-surface-2">
            {photo && (
              <img
                src={imageUrl(photo, 800)}
                alt={`Portrait of ${SITE.name}`}
                width={800}
                height={1000}
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: settings?.heroFocalPoint || '50% 30%' }}
              />
            )}
          </div>
          {/* Name plate across the bottom edge of the photo */}
          <div className="absolute -bottom-px left-0 grid gap-0.5 border border-line bg-surface px-4 py-3">
            <span className="font-medium tracking-[-0.01em]">{SITE.fullName}</span>
            <Label className="text-fg-soft">{SITE.role}</Label>
          </div>
          <span
            aria-hidden="true"
            className="hero-tile hero-tile-accent absolute -top-3 -right-3 size-6 bg-tangerine-500 md:size-8"
            style={{ animationDelay: '0.75s' }}
          />
        </div>
      </Container>
    </section>
  );
};
