package com.luv2code.doan.request;

import lombok.*;

import javax.validation.constraints.NotNull;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class CapturePaymentRequest {
    @NotNull(message = "OrderId must not be null!")
    private String orderId;
}
