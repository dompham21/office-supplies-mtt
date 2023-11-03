package com.luv2code.doan.request;

import lombok.*;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class PurchaseOrderDetailRequest {
    @NotNull(message = "Quantity must not be null")
    @Min(value = 1, message = "Quantity should be greater than 1")
    private Integer quantity;

    @NotNull(message = "Price must not be null")
    @Min(value = 0, message = "Price should be greater than 0")
    private Float unitPrice;

    @NotNull(message = "Product must not be null!")
    private String productId;
}
