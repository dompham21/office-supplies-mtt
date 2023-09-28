package com.luv2code.doan.dto;

import com.luv2code.doan.entity.Cart;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class CartDto {
    private Integer id;

    private ProductDto product;

    private Integer quantity;

    public CartDto(Cart cart, ProductDto product) {
        this.product = product;
        this.id = cart.getId();
        this.quantity = cart.getQuantity();
    }
}
