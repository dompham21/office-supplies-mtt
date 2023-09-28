package com.luv2code.doan.request;

import lombok.*;

import javax.validation.constraints.NotNull;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class MakePaymentRequest {
    @NotNull(message = "Total must not be null!")
    private String total;
}
