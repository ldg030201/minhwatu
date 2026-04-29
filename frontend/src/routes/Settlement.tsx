import { Link } from 'react-router-dom';

export function SettlementRoute() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col gap-6 px-6 py-10">
      <Link to="/" className="text-meta text-ink-3 hover:text-ink">
        ← 로비
      </Link>
      <h2 className="font-serif text-3xl font-bold text-ink">정산 (stub)</h2>
      <p className="text-ink-2 leading-relaxed">
        라운드 종료 후 점수 정산 화면. 단(短) 보너스 카운트업·승자 글로우 등 마이크로 이벤트는 다음 PR의
        마이그레이션에서 들어옵니다.
      </p>
    </main>
  );
}
