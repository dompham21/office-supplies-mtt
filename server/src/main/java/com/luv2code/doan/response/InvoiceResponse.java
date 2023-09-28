package com.luv2code.doan.response;

import com.luv2code.doan.dto.CustomerDto;
import com.luv2code.doan.dto.InvoiceDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InvoiceResponse extends BaseResponse {
    private InvoiceDto data;

    public InvoiceResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, InvoiceDto data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}
