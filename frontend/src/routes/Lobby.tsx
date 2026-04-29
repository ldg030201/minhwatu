import { Link } from 'react-router-dom';

export function LobbyRoute() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-start justify-center gap-6 px-6">
      <p className="font-mono text-meta text-ink-3 uppercase tracking-widest">민화투 — Lobby (stub)</p>
      <h1 className="font-serif text-5xl font-bold text-ink">민화투</h1>
      <p className="text-ink-2 leading-relaxed">
        실시간 웹 민화투. 본 화면은 스캐폴딩 단계의 빈 라우트이며, 디자인 시안의 게임 보드/정산은 다음 PR에서
        <code className="mx-1 rounded bg-bg-2 px-2 py-0.5 font-mono">src/components</code>로 이관됩니다.
      </p>
      <div className="flex gap-3">
        <Link
          to="/game"
          className="inline-flex items-center rounded-md bg-paulownia px-4 py-2 font-semibold text-bg shadow-soft transition-transform hover:-translate-y-0.5"
        >
          게임 보드 (stub)
        </Link>
        <Link
          to="/settlement"
          className="inline-flex items-center rounded-md bg-bg-2 px-4 py-2 font-semibold text-ink shadow-soft transition-transform hover:-translate-y-0.5"
        >
          정산 (stub)
        </Link>
      </div>
    </main>
  );
}
