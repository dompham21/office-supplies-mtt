package com.luv2code.doan.response;

import com.luv2code.doan.dto.OrderDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ListOrderResponse extends BaseResponse {
    List<OrderDto> data;
    Integer totalPage;
    Integer pageNo;

    public ListOrderResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<OrderDto> data, Integer totalPage, Integer pageNo) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
        this.totalPage = totalPage;
        this.pageNo = pageNo;
    }
}
