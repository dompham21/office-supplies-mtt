package com.luv2code.doan.response;

import com.luv2code.doan.dto.CategoryDto;
import com.luv2code.doan.dto.RoleDto;
import lombok.*;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ListRoleResponse extends BaseResponse{
    private List<RoleDto> data;
    private Integer totalPage;

    public ListRoleResponse(Integer result, String msg, String method, Long timestamp, String status, Integer code, List<RoleDto> data, Integer totalPage) {
        super(result, msg, method, timestamp, status, code);
        this.data = data;
        this.totalPage = totalPage;
    }
}
