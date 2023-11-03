package com.luv2code.doan.repository;

import com.luv2code.doan.entity.Promotion;
import com.luv2code.doan.entity.PurchaseOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;


@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, String> {
    @Query("SELECT c FROM PurchaseOrder c")
    public Page<PurchaseOrder> getListPurchaseOrdersAdmin(Pageable pageable);

    public List<PurchaseOrder> getAllByIsActiveTrue();
    public boolean existsById(String id);
}
