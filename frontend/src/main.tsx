import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { App } from '@/App';
import { GameRoute } from '@/routes/Game';
import { LobbyRoute } from '@/routes/Lobby';
import { SettlementRoute } from '@/routes/Settlement';

import '@/styles/index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <LobbyRoute /> },
      { path: 'game', element: <GameRoute /> },
      { path: 'settlement', element: <SettlementRoute /> },
    ],
  },
]);

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('root element not found');
}

createRoot(rootEl).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
