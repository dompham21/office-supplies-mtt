package com.luv2code.doan.response;

import com.luv2code.doan.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ListOrderStatusResponse extends BaseResponse {
    private List<OrderStatus> data;

    public ListOrderStatusResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<OrderStatus> data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}
