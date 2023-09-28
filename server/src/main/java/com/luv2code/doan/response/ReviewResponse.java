package com.luv2code.doan.response;

import com.luv2code.doan.dto.ReviewDto;
import com.luv2code.doan.entity.Review;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReviewResponse extends BaseResponse {
    private ReviewDto data;

    public ReviewResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, ReviewDto data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}
