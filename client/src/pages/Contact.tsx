import ContactSection from '../components/sections/Contact';
import { usePageTitle } from '../hooks/usePageTitle';

const Contact = () => {
  usePageTitle('Contact');
  return <ContactSection />;
};

export default Contact;
