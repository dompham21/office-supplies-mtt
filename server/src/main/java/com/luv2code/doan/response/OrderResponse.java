package com.luv2code.doan.response;

import com.luv2code.doan.dto.OrderDto;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderResponse extends BaseResponse {
    private OrderDto data;

    public OrderResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, OrderDto data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}
