package com.minhwatu.application;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 진입점 smoke test.
 * <p>
 * Spring 컨텍스트가 정상 로딩되는지 + /api/health가 200을 반환하는지만 확인한다.
 * 실제 API 검증은 추후 api 모듈에서 더 풍부하게.
 */
@SpringBootTest
@AutoConfigureMockMvc
class MinhwatuApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void context가_로딩된다() {
        // SpringBootTest가 컨텍스트 로딩 자체를 검증한다. 로딩 실패 시 본 테스트가 깨진다.
    }

    @Test
    void 헬스체크는_UP과_카탈로그_크기48을_반환한다() throws Exception {
        mockMvc.perform(get("/api/health"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("UP"))
            .andExpect(jsonPath("$.service").value("minhwatu"))
            .andExpect(jsonPath("$.cardCatalogSize").value(48));
    }
}
