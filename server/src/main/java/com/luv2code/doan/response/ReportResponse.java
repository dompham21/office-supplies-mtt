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
public class ReportResponse extends BaseResponse {
    private List<Long> data;
    private List<String> label;

    public ReportResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<Long> data, List<String> label) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
        this.label = label;
    }
}
