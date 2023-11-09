package com.luv2code.doan.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderCancelReportResponse extends BaseResponse {
    private List<Long> data;
    private List<String> label;
    private long totalOrder;
    private long totalOrderCancel;


    public OrderCancelReportResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<Long> data, List<String> label, long totalOrder, long totalOrderCancel) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
        this.label = label;
        this.totalOrder = totalOrder;
        this.totalOrderCancel = totalOrderCancel;
    }
}
