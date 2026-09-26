import { createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import Home from '../pages/Home';
import AdminLogin from '../pages/admin/Login';
import AdminDashboard from '../pages/admin/Dashboard';

// Root route — renders child routes via Outlet
const rootRoute = createRootRoute({
  component: Outlet,
});

// Public routes
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

// Admin routes
const adminIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: () => {
    throw redirect({ to: '/admin/login' });
  },
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: AdminLogin,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  component: AdminDashboard,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  adminIndexRoute,
  adminLoginRoute,
  adminDashboardRoute,
]);

export const router = createRouter({ routeTree });

// TypeScript registration
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
