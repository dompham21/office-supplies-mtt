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
public class SaleHistoryResponse extends BaseResponse {
    private List<Double> data;
    private List<String> label;

    public SaleHistoryResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<Double> data, List<String> label) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
        this.label = label;
    }
}
