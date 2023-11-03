package com.luv2code.doan.service;

import com.luv2code.doan.entity.Product;
import com.luv2code.doan.entity.Promotion;
import com.luv2code.doan.entity.PurchaseOrder;
import com.luv2code.doan.exceptions.NotFoundException;
import com.luv2code.doan.exceptions.PromotionNotFoundException;
import org.springframework.data.domain.Page;

import java.util.Date;
import java.util.List;

public interface PurchaseOrderService {
    public PurchaseOrder getPurchaseOrderById(String id) throws NotFoundException;

    public PurchaseOrder savePurchaseOrder(PurchaseOrder purchaseOrder);

    public Page<PurchaseOrder> getListPurchaseOrdersAdmin( int pageNo, int pageSize, String sortField, String sortDirection);

    public List<PurchaseOrder> findPurchaseOrder(Date startDate, Date finishDate);

    public int getCurrentPromotionByProduct(Product product);

    public boolean existsById(String id);
    public List<PurchaseOrder> getAllByIsActiveTrue();
}
