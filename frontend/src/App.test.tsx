import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { App } from '@/App';
import { LobbyRoute } from '@/routes/Lobby';

describe('App', () => {
  it('로비 라우트에서 메인 헤딩과 액션 링크를 노출한다', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<App />}>
            <Route index element={<LobbyRoute />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: '민화투' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '게임 보드 (stub)' })).toHaveAttribute('href', '/game');
    expect(screen.getByRole('link', { name: '정산 (stub)' })).toHaveAttribute('href', '/settlement');
  });
});
