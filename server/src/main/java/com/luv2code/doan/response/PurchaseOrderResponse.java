package com.luv2code.doan.response;

import com.luv2code.doan.dto.PromotionDto;
import com.luv2code.doan.dto.PurchaseOrderDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PurchaseOrderResponse extends BaseResponse {
    private PurchaseOrderDto data;

    public PurchaseOrderResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, PurchaseOrderDto data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}
