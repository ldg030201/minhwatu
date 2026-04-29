package com.minhwatu.application.health;

import com.minhwatu.core.card.CardCatalog;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * 헬스체크 엔드포인트.
 * <p>
 * 추후 {@code api} 모듈로 이관되어 더 풍부한 상태(WebSocket 연결 수, 활성 룸 수 등)를
 * 노출할 것이다. 본 PR에서는 진입점이 살아있는지와 core가 제대로 wiring되는지만 확인한다.
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public Map<String, Object> get() {
        return Map.of(
            "status", "UP",
            "service", "minhwatu",
            "timestamp", Instant.now().toString(),
            // core 모듈이 정상 import되었는지를 간접 확인 — 표준 카탈로그 48장
            "cardCatalogSize", CardCatalog.all().size()
        );
    }
}
