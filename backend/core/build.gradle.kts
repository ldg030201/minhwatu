// core 모듈 — 순수 게임 엔진.
// ADR-0001: 외부 라이브러리 의존성 0(Java 표준 + JSR-310만). Spring/JPA/HTTP/SLF4J 등 절대 금지.
// 테스트 의존성(JUnit 5 + AssertJ)만 testImplementation으로 둔다.

plugins {
    `java-library`
}

description = "민화투 순수 게임 엔진. 프레임워크 의존성 0."

dependencies {
    // ── runtime ──────────────────────────────────────────────────
    // (의도적으로 비워둠 — Java 표준 라이브러리만 사용)

    // ── test ────────────────────────────────────────────────────
    testImplementation(platform("org.junit:junit-bom:5.11.4"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
    testImplementation("org.assertj:assertj-core:3.27.0")
}

tasks.test {
    // 게임 룰 테스트는 빠르게, 결정적으로 돌아야 한다.
    maxParallelForks = (Runtime.getRuntime().availableProcessors() / 2).coerceAtLeast(1)
}
