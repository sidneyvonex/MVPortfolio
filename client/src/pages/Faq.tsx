import { CtaBand } from '../components/sections/Bands';
import { FaqList } from '../components/sections/Lists';
import { PageHeader } from '../components/sections/PageHeader';
import { Container } from '../components/ui/Container';
import { FAQS } from '../data/faq';
import { usePageTitle } from '../hooks/usePageTitle';

const Faq = () => {
  usePageTitle('FAQ');

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'FAQ' }]}
        title="Questions people ask first."
        lead="How work starts, how it is priced, and what happens after launch."
      />
      <section>
        <Container className="py-16 md:py-24">
          <FaqList items={FAQS} />
        </Container>
      </section>
      <CtaBand title="Still have a question?" />
    </>
  );
};

export default Faq;
