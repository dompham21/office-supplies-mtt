package com.luv2code.doan.repository;

import com.luv2code.doan.entity.Brand;
import com.luv2code.doan.entity.ImageProduct;
import com.luv2code.doan.entity.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;


@Repository
public interface PromotionRepository extends JpaRepository<Promotion, String> {
    @Query("SELECT c FROM Promotion c")
    public Page<Promotion> getListPromotionsAdmin(Pageable pageable);

    public List<Promotion> findByStartAtBeforeAndEndAtAfterOrderByIdDesc(Date start, Date end);

    public boolean existsById(String id);
}
