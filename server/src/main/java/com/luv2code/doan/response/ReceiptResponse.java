package com.luv2code.doan.response;

import com.luv2code.doan.dto.PurchaseOrderDto;
import com.luv2code.doan.dto.ReceiptDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReceiptResponse extends BaseResponse {
    private ReceiptDto data;

    public ReceiptResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, ReceiptDto data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}
