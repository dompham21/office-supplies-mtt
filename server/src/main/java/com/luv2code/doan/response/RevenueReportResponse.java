package com.luv2code.doan.response;

import com.luv2code.doan.bean.RevenueYearItem;
import com.luv2code.doan.dto.RevenueDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RevenueReportResponse extends BaseResponse {
    private List<RevenueYearItem> data;

    public RevenueReportResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<RevenueYearItem> data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}
