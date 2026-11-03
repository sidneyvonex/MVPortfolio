import AboutSection from '../components/sections/About';
import Resume from '../components/sections/Resume';
import Skills from '../components/sections/Skills';
import Education from '../components/sections/Education';
import Community from '../components/sections/Community';
import Testimonials from '../components/sections/Testimonials';
import { usePageTitle } from '../hooks/usePageTitle';

// The full background: story, experience, skills, education, community and what people say.
const About = () => {
  usePageTitle('About');

  return (
    <>
      <AboutSection />
      <Resume />
      <Skills />
      <Education />
      <Community />
      <Testimonials />
    </>
  );
};

export default About;
