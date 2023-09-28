package com.luv2code.doan.repository;

import com.luv2code.doan.entity.Account;
import com.luv2code.doan.entity.Invoice;
import com.luv2code.doan.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String> {
   public Invoice getInvoiceByOrder(Order order);
   public boolean existsInvoiceById(String id);
}
