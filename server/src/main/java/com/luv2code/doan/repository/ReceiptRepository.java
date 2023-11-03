package com.luv2code.doan.repository;

import com.luv2code.doan.entity.PurchaseOrder;
import com.luv2code.doan.entity.Receipt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, String> {
    @Query("SELECT c FROM Receipt c")
    public Page<Receipt> getListReceiptsAdmin(Pageable pageable);


    public boolean existsById(String id);
}
