package com.luv2code.doan.service;

import com.luv2code.doan.entity.Account;
import com.luv2code.doan.entity.Invoice;
import com.luv2code.doan.entity.Order;
import com.luv2code.doan.exceptions.NotFoundException;

public interface InvoiceService {
    public Invoice getInvoiceByOrder(Order order);
    public boolean existsInvoiceById(String id);
    public Invoice saveInvoice(Invoice invoice);

}
