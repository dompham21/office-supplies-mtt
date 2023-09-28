package com.luv2code.doan.dto;

import com.luv2code.doan.entity.Customer;
import com.luv2code.doan.entity.Staff;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StaffDto {
    private String id;

    private String email;

    private String name;

    private String phone;

    private Date registrationDate;

    private Boolean isActive;

    private String avatar;

    private String role;
    private String address;
    private String gender;

    public StaffDto(Staff staff) {
        this.id = staff.getId();
        this.email = staff.getAccount().getEmail();
        this.name = staff.getName();
        this.phone = staff.getPhone();
        this.registrationDate = staff.getRegistrationDate();
        this.isActive = staff.getAccount().getIsActive();
        this.avatar = staff.getAvatar();
        this.role = staff.getAccount().getRole().getName();
        this.address = staff.getAddress();
        this.gender = staff.getGender();
    }
}