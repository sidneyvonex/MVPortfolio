import { Navigate, Route, Routes } from 'react-router';
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';
import Work from './pages/Work';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';

export const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="work" element={<Work />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Route>

    {/* Admin: its own frame, no public header or footer */}
    <Route path="admin" element={<Navigate to="/admin/login" replace />} />
    <Route path="admin/login" element={<AdminLogin />} />
    <Route path="admin/dashboard" element={<AdminDashboard />} />
  </Routes>
);
