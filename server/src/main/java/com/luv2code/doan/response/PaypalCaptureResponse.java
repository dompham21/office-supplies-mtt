package com.luv2code.doan.response;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PaypalCaptureResponse {
    private String id;
    private String status;
}
