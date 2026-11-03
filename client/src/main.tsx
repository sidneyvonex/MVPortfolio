import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { App } from './App';
import { INITIAL_DATA_ID, seedQueryClient } from './lib/initialData';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

// Prerendered pages carry the data they were built with; start from it and refresh in the background.
const embedded = document.getElementById(INITIAL_DATA_ID)?.textContent;
if (embedded) seedQueryClient(queryClient, JSON.parse(embedded), 0);

const app = (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);

// Toasts (used by the admin) live in their own root, outside the prerendered markup.
const toasts = document.createElement('div');
document.body.appendChild(toasts);
createRoot(toasts).render(<Toaster position="top-right" richColors closeButton />);

// Prerendered pages are hydrated; the admin shell and the dev server start from an empty root.
const root = document.getElementById('root')!;
// (The dev server's root holds only the <!--app-html--> marker comment, which is not an element.)
if (root.firstElementChild) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
