package com.luv2code.doan.dto;

import com.luv2code.doan.entity.OrderDetail;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class OrderDetailDto {
    private Integer quantity;
    private Float unitPrice;
    private ProductDto product;
    private Boolean hasReviewed;

    public OrderDetailDto(OrderDetail orderDetail, ProductDto product) {
        this.quantity = orderDetail.getQuantity();
        this.unitPrice = orderDetail.getUnitPrice();
        this.product = product;
    }

    public OrderDetailDto(OrderDetail orderDetail, ProductDto product, Boolean hasReviewed) {
        this.quantity = orderDetail.getQuantity();
        this.unitPrice = orderDetail.getUnitPrice();
        this.product = product;
        this.hasReviewed = hasReviewed;
    }
}
