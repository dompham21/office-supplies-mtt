package com.luv2code.doan.dto;

import com.luv2code.doan.entity.PromotionDetail;
import com.luv2code.doan.entity.PurchaseOrder;
import com.luv2code.doan.entity.PurchaseOrderDetail;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class PurchaseOrderDetailDto {
    private Integer quantity;
    private Float unitPrice;
    private ProductDto product;

    public PurchaseOrderDetailDto(PurchaseOrderDetail purchaseOrderDetail, ProductDto product) {
        this.quantity = purchaseOrderDetail.getQuantity();
        this.unitPrice = purchaseOrderDetail.getUnitPrice();
        this.product = product;
    }
}
