import { Outlet } from 'react-router-dom';

export function App() {
  return (
    <div className="min-h-dvh bg-bg text-ink font-sans antialiased">
      <Outlet />
    </div>
  );
}
