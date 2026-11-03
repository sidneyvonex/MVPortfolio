import Portfolio from '../components/sections/Portfolio';
import { usePageTitle } from '../hooks/usePageTitle';

const Work = () => {
  usePageTitle('Work');
  return <Portfolio />;
};

export default Work;
