import { Link } from 'react-router-dom';

export function GameRoute() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col gap-6 px-6 py-10">
      <Link to="/" className="text-meta text-ink-3 hover:text-ink">
        ← 로비
      </Link>
      <h2 className="font-serif text-3xl font-bold text-ink">게임 보드 (stub)</h2>
      <p className="text-ink-2 leading-relaxed">
        디자인 시안의 게임 보드는{' '}
        <code className="rounded bg-bg-2 px-2 py-0.5 font-mono">frontend/preview/</code>에 보관되어 있고, 다음
        PR에서 이 라우트로 이관됩니다. 컴포넌트 트리/타입은
        <code className="mx-1 rounded bg-bg-2 px-2 py-0.5 font-mono">frontend/preview/HANDOFF.md</code> 참조.
      </p>
    </main>
  );
}
