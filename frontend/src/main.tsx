import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { App } from '@/App';
import { GameRoute } from '@/routes/Game';
import { LobbyRoute } from '@/routes/Lobby';
import { SettlementRoute } from '@/routes/Settlement';

import '@/styles/index.css';
// 시안 css 4종(원형 보존). 점진적으로 Tailwind 클래스로 대체.
import '@/legacy/styles/tokens.css';
import '@/legacy/styles/card.css';
import '@/legacy/styles/board.css';
import '@/legacy/styles/settlement.css';

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
