package com.luv2code.doan.service.impl;

import com.luv2code.doan.entity.Product;
import com.luv2code.doan.entity.Promotion;
import com.luv2code.doan.entity.PromotionDetail;
import com.luv2code.doan.entity.PurchaseOrder;
import com.luv2code.doan.exceptions.NotFoundException;
import com.luv2code.doan.exceptions.PromotionNotFoundException;
import com.luv2code.doan.repository.PromotionDetailRepository;
import com.luv2code.doan.repository.PromotionRepository;
import com.luv2code.doan.repository.PurchaseOrderRepository;
import com.luv2code.doan.service.PromotionService;
import com.luv2code.doan.service.PurchaseOrderService;
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
public class PurchaseOrderServiceImpl implements PurchaseOrderService {
    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private PromotionDetailRepository promotionDetailRepository;

    @Override
    public PurchaseOrder getPurchaseOrderById(String id) throws NotFoundException {
        try {
            PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id).get();
            return purchaseOrder;

        }
        catch(NoSuchElementException ex) {
            throw new NotFoundException("Could not find any promotion with ID " + id);
        }
    }

    @Override
    public PurchaseOrder savePurchaseOrder(PurchaseOrder purchaseOrder) {
        return purchaseOrderRepository.save(purchaseOrder);
    }

    @Override
    public Page<PurchaseOrder> getListPurchaseOrdersAdmin(int pageNo, int pageSize, String sortField, String sortDirection) {
        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortField).ascending() : Sort.by(sortField).descending() ;
        Pageable pageable = PageRequest.of(pageNo -1, pageSize,sort);

        return purchaseOrderRepository.getListPurchaseOrdersAdmin(pageable);
    }

    @Override
    public List<PurchaseOrder> findPurchaseOrder(Date startDate, Date finishDate) {
        return null;
    }

    @Override
    public int getCurrentPromotionByProduct(Product product) {
        return 0;
    }


    @Override
    public boolean existsById(String id) {
        return purchaseOrderRepository.existsById(id);
    }

    @Override
    public List<PurchaseOrder> getAllByIsActiveTrue() {
        return purchaseOrderRepository.getAllByIsActiveTrue();
    }


}
