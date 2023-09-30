package com.luv2code.doan.repository;

import com.luv2code.doan.bean.PromotionDetailKey;
import com.luv2code.doan.entity.Product;
import com.luv2code.doan.entity.Promotion;
import com.luv2code.doan.entity.PromotionDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface PromotionDetailRepository extends JpaRepository<PromotionDetail, PromotionDetailKey> {
    @Modifying
    @Query("DELETE FROM PromotionDetail pd WHERE pd.promotion.id = :promotionId")
    void deleteByPromotionId(@Param("promotionId") String promotionId);

    public PromotionDetail getPromotionDetailByProductAndAndPromotion(Product product, Promotion promotion);

    public List<PromotionDetail> getPromotionDetailByPromotion(Promotion promotion);
}
