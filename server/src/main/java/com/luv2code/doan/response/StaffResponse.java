package com.luv2code.doan.response;

import com.luv2code.doan.dto.StaffDto;
import com.luv2code.doan.dto.UserDto;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StaffResponse extends BaseResponse {
    private StaffDto data;


    public StaffResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, StaffDto data) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
    }
}

