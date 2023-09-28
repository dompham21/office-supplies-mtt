package com.luv2code.doan.response;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PaypalTokenResponse {
    String scope;
    String access_token;
    String token_type;
    String app_id;
    String expires_in;
    String nonce;
}
