package com.luv2code.doan.response;

import com.luv2code.doan.dto.SupplierDto;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SupplierResponse extends BaseResponse {

    private SupplierDto data;

    public SupplierResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, SupplierDto data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}
