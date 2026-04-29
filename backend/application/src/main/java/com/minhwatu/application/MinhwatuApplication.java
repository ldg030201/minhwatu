package com.minhwatu.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 민화투 백엔드 진입점.
 * <p>
 * 본 클래스는 Spring 컨텍스트의 wiring 책임만 진다. 게임 룰/상태/점수 로직은
 * {@code core} 모듈에 있고, 외부 통신(REST/WebSocket)·영속화는 추후 {@code api} ·
 * {@code persistence} 모듈에서 어댑터로 들어온다(ADR-0001).
 *
 * <h2>실행</h2>
 * <pre>
 * ./gradlew :application:bootRun
 * </pre>
 *
 * <p>또는 IntelliJ에서 본 클래스를 우클릭 → Run.
 */
@SpringBootApplication
public class MinhwatuApplication {

    public static void main(String[] args) {
        SpringApplication.run(MinhwatuApplication.class, args);
    }
}
