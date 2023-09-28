package com.luv2code.doan.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luv2code.doan.dto.CartDto;
import com.luv2code.doan.entity.Cart;
import lombok.*;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class OrderRequest {
    @NotNull(message = "Please select product to order!")
    private List<CartDto> listCart;

    @NotBlank(message = "Address must not be blank")
    @Size(max = 100, message = "Address should be less than 100 characters")
    private String address;

    @NotBlank(message = "Payment method must not be blank")
    @Size(max = 10, message = "Payment method should be less than 10 characters")
    private String paymentMethod;
}
