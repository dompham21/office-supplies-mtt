package com.luv2code.doan.repository;

import com.luv2code.doan.bean.PriceHistoryKey;
import com.luv2code.doan.entity.PriceHistory;
import com.luv2code.doan.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface PriceHistoryRepository extends JpaRepository<PriceHistory, PriceHistoryKey> {

    @Query(value = "SELECT [dbo].[FUNC_LAY_GIA_SAN_PHAM](:productId) as price", nativeQuery = true)
    public Float getPriceByProductId(String productId);
}
