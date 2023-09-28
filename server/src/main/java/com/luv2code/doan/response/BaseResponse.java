package com.luv2code.doan.response;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BaseResponse {
    private Integer result;
    private String msg;
    private String method;
    private Long timestamp;
    private String status;
    private Integer code;
}
