package com.luv2code.doan.service.impl;

import com.luv2code.doan.entity.Product;
import com.luv2code.doan.entity.PurchaseOrder;
import com.luv2code.doan.entity.Receipt;
import com.luv2code.doan.exceptions.NotFoundException;
import com.luv2code.doan.repository.PromotionDetailRepository;
import com.luv2code.doan.repository.PurchaseOrderRepository;
import com.luv2code.doan.repository.ReceiptRepository;
import com.luv2code.doan.service.PurchaseOrderService;
import com.luv2code.doan.service.ReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ReceiptServiceImpl implements ReceiptService {
    @Autowired
    private ReceiptRepository receiptRepository;



    @Override
    public Receipt getReceiptById(String id) throws NotFoundException {
        try {
            Receipt receipt = receiptRepository.findById(id).get();
            return receipt;

        }
        catch(NoSuchElementException ex) {
            throw new NotFoundException("Could not find any receipt with ID " + id);
        }
    }

    @Override
    public Receipt saveReceipt(Receipt receipt) {
        return receiptRepository.save(receipt);
    }

    @Override
    public Page<Receipt> getListReceiptAdmin(int pageNo, int pageSize, String sortField, String sortDirection) {
        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortField).ascending() : Sort.by(sortField).descending() ;
        Pageable pageable = PageRequest.of(pageNo -1, pageSize,sort);

        return receiptRepository.getListReceiptsAdmin(pageable);
    }

    @Override
    public boolean existsById(String id) {
        return receiptRepository.existsById(id);
    }


}
