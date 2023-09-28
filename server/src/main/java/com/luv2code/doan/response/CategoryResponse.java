package com.luv2code.doan.response;

import com.luv2code.doan.dto.CategoryDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CategoryResponse extends BaseResponse {
    private CategoryDto data;

    public CategoryResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, CategoryDto data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}
