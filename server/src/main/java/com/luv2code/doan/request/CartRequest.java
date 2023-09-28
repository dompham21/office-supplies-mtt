package com.luv2code.doan.request;

import lombok.*;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class CartRequest {
    @NotBlank(message = "Product id must not be blank!")
    String id;

    @NotNull(message = "Quantity must not be null!")
    @Min(value = 1, message = "Quantity must be positive!")
    Integer quantity;
}
