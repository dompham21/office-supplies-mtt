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
public class ListSuggestResponse extends BaseResponse {
    List<String> data;

    public ListSuggestResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<String> data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}
