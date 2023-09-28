package com.luv2code.doan.request;

import com.luv2code.doan.dto.CartDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CheckoutRequest {
    @NotBlank(message = "Name must not be blank")
    @Size(max = 50, message = "Name should be less than 50 characters")
    private String name;

    @NotBlank(message = "Address must not be blank")
    @Size(max = 100, message = "Address should be less than 100 characters")
    private String address;

    @NotBlank(message = "Phone must not be blank")
    @Size(max = 11, message = "Phone should be less than 11 characters")
    private String phone;

    @NotNull(message = "List cart must not be null")
    private List<CartDto> carts;
}
