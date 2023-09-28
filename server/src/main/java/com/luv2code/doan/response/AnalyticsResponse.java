package com.luv2code.doan.response;

import com.luv2code.doan.dto.BrandDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AnalyticsResponse extends BaseResponse {
    private Double total_revenue;
    private Long total_user;
    private Long total_review;
    private Long total_order;

    public AnalyticsResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, Double total_revenue, Long total_user, Long total_review, Long total_order) {
        super(result, msg, method, timestamp, status, code);
        this.total_revenue = total_revenue;
        this.total_user = total_user;
        this.total_review = total_review;
        this.total_order = total_order;
    }
}
