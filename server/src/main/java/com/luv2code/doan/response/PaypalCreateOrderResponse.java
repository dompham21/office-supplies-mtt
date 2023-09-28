package com.luv2code.doan.response;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PaypalCreateOrderResponse {
    private String id;
    private String status;
}
