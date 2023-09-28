package com.luv2code.doan.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UploadImageResponse extends BaseResponse {
    private String data;
    public UploadImageResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, String data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}
