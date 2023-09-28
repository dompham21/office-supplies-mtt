package com.luv2code.doan.dto;

import com.luv2code.doan.entity.Staff;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ShipperDto extends UserDto {
    private Integer numberDelivering;

    public ShipperDto(Staff staff, Integer numberDelivering) {
        super(staff);
        this.numberDelivering = numberDelivering;
    }
}
