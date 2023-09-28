package com.luv2code.doan.service;


import com.luv2code.doan.entity.PriceHistory;
import com.luv2code.doan.entity.Staff;

public interface PriceHistoryService {
    public float getPriceFromProductId(String productId);
    public PriceHistory savePriceHistory(PriceHistory priceHistory);

}
