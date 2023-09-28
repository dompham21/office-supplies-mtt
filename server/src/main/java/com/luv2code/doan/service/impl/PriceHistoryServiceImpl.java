package com.luv2code.doan.service.impl;

import com.luv2code.doan.entity.PriceHistory;
import com.luv2code.doan.repository.PriceHistoryRepository;
import com.luv2code.doan.service.PriceHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@RequiredArgsConstructor
@Service
@Transactional
@Slf4j
public class PriceHistoryServiceImpl implements PriceHistoryService {

    @Autowired
    private PriceHistoryRepository priceHistoryRepository;

    @Override
    public float getPriceFromProductId(String productId) {
        return priceHistoryRepository.getPriceByProductId(productId);
    }

    @Override
    public PriceHistory savePriceHistory(PriceHistory priceHistory) {
        return priceHistoryRepository.save(priceHistory);
    }
}
