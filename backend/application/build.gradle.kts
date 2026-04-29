// application 모듈 — Spring Boot 진입점 + 모든 어댑터 wiring.
// ADR-0001: application은 core/api/persistence를 모두 import할 수 있는 유일한 모듈.

plugins {
    java
    id("org.springframework.boot")
    id("io.spring.dependency-management")
}

description = "민화투 Spring Boot 진입점. bootRun은 여기서 실행한다."

dependencies {
    // ── runtime ──────────────────────────────────────────────────
    implementation(project(":core"))
    implementation("org.springframework.boot:spring-boot-starter-web")

    // ── test ────────────────────────────────────────────────────
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

springBoot {
    mainClass.set("com.minhwatu.application.MinhwatuApplication")
}

tasks.bootJar {
    archiveFileName.set("minhwatu.jar")
}

// 컴파일러 옵션은 root build.gradle.kts의 subprojects {}에서 일괄 적용된다.
