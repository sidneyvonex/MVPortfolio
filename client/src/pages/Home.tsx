import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Resume from '../components/sections/Resume';
import Skills from '../components/sections/Skills';
import Portfolio from '../components/sections/Portfolio';
import Education from '../components/sections/Education';
import Community from '../components/sections/Community';
import Testimonials from '../components/sections/Testimonials';
import Contact from '../components/sections/Contact';
import { usePageTitle } from '../hooks/usePageTitle';

// One page with every section. Each becomes a short summary linking to its own page as the
// sections are restyled.
const Home = () => {
  usePageTitle();

  return (
    <div className="animate-fadeIn">
      <Hero />
      <About />
      <Resume />
      <Skills />
      <Portfolio />
      <Education />
      <Community />
      <Testimonials />
      <Contact />
    </div>
  );
};

export default Home;
