package com.luv2code.doan.service;

import com.luv2code.doan.entity.Product;
import com.luv2code.doan.entity.PurchaseOrder;
import com.luv2code.doan.entity.Receipt;
import com.luv2code.doan.exceptions.NotFoundException;
import org.springframework.data.domain.Page;

import java.util.Date;
import java.util.List;

public interface ReceiptService {
    public Receipt getReceiptById(String id) throws NotFoundException;

    public Receipt saveReceipt(Receipt receipt);

    public Page<Receipt> getListReceiptAdmin( int pageNo, int pageSize, String sortField, String sortDirection);

    public boolean existsById(String id);
}
