// 루트 빌드 — 공통 설정만 둔다. 모듈별 build.gradle.kts에서 각자 의존성/플러그인 선언.

plugins {
    java
}

allprojects {
    group = "com.minhwatu"
    version = "0.0.1-SNAPSHOT"

    repositories {
        mavenCentral()
    }
}

subprojects {
    apply(plugin = "java")

    extensions.configure<JavaPluginExtension> {
        toolchain {
            languageVersion.set(JavaLanguageVersion.of(21))
        }
    }

    tasks.withType<JavaCompile>().configureEach {
        options.encoding = "UTF-8"
        // 한국어 식별자 금지(CLAUDE.md §4-1)와 별개로, 컴파일 경고를 깔끔히.
        options.compilerArgs.addAll(listOf("-Xlint:all", "-parameters"))
    }

    tasks.withType<Test>().configureEach {
        useJUnitPlatform()
        testLogging {
            events("passed", "skipped", "failed")
            showStandardStreams = false
        }
    }
}
