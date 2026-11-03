import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Label } from '../components/ui/Label';
import { usePageTitle } from '../hooks/usePageTitle';

const NotFound = () => {
  usePageTitle('Page not found');

  return (
    <Container className="grid justify-items-start gap-6 py-28 md:py-40">
      <Label dot className="text-fg-soft">
        404
      </Label>
      <h1 className="max-w-[16ch] text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.02] tracking-[-0.04em]">
        This page doesn't exist.
      </h1>
      <p className="max-w-[46ch] text-lg text-fg-soft">
        The link may be old, or the address has a typo. Everything is still a click away.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button to="/">Back home</Button>
        <Button to="/work" variant="ghost">
          See the work
        </Button>
      </div>
    </Container>
  );
};

export default NotFound;
