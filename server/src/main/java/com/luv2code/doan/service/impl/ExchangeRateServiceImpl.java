package com.luv2code.doan.service.impl;

import com.luv2code.doan.service.ExchangeRateService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ExchangeRateServiceImpl implements ExchangeRateService {
    private final RestTemplate restTemplate;

    public ExchangeRateServiceImpl(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    public String getApiKey() {
        String apiKeyUrl = "https://vapi.vnappmob.com/api/request_api_key?scope=exchange_rate";
        ResponseEntity<Map> response = restTemplate.getForEntity(apiKeyUrl, Map.class);
        Map<String, String> result = response.getBody();
        System.out.println(result.get("results"));
        if (result != null) {
            return result.get("results");
        }
        throw new RuntimeException("USD currency not found in the API response");
    }

    public double getUSDSellRate() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(getApiKey());
        HttpEntity<String> entity = new HttpEntity<>(headers);

        String exchangeRateUrl = "https://vapi.vnappmob.com/api/v2/exchange_rate/sbv";
        ResponseEntity<Map> response = restTemplate.exchange(exchangeRateUrl, HttpMethod.GET, entity, Map.class);
        List<Map<String, Object>> results = (List<Map<String, Object>>) response.getBody().get("results");

        Optional<Map<String, Object>> usdResult = results.stream()
                .filter(result -> "USD".equals(result.get("currency")))
                .findFirst();

        if (usdResult.isPresent()) {
            return (double) usdResult.get().get("sell");
        } else {
            throw new RuntimeException("USD currency not found in the API response");
        }
    }
}
