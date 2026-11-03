import { Navigate, Route, Routes } from 'react-router';
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Work from './pages/Work';
import CaseStudy from './pages/CaseStudy';
import About from './pages/About';
import Contact from './pages/Contact';
import Faq from './pages/Faq';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';

export const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="services" element={<Services />} />
      <Route path="services/:slug" element={<ServiceDetail />} />
      <Route path="work" element={<Work />} />
      <Route path="work/:slug" element={<CaseStudy />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="faq" element={<Faq />} />
      <Route path="privacy" element={<Privacy />} />
      <Route path="*" element={<NotFound />} />
    </Route>

    {/* Admin: its own frame, no public header or footer */}
    <Route path="admin" element={<Navigate to="/admin/login" replace />} />
    <Route path="admin/login" element={<AdminLogin />} />
    <Route path="admin/dashboard" element={<AdminDashboard />} />
  </Routes>
);
