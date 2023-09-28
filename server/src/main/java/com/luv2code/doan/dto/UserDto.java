package com.luv2code.doan.dto;

import com.luv2code.doan.entity.Customer;
import com.luv2code.doan.entity.Staff;
import lombok.*;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDto {
    private String id;

    private String email;

    private String name;

    private String phone;

    private Date registrationDate;

    private Boolean isActive;

    private String avatar;

    private String role;



    public UserDto(Customer customer) {
        this.id = String.valueOf(customer.getId());
        this.email = customer.getAccount().getEmail();
        this.name = customer.getName();
        this.phone = customer.getPhone();
        this.registrationDate = customer.getRegistrationDate();
        this.isActive = customer.getAccount().getIsActive();
        this.avatar = customer.getAvatar();
        this.role = customer.getAccount().getRole().getName();

    }

    public UserDto(Staff staff) {
        this.id = staff.getId();
        this.email = staff.getAccount().getEmail();
        this.name = staff.getName();
        this.phone = staff.getPhone();
        this.registrationDate = staff.getRegistrationDate();
        this.isActive = staff.getAccount().getIsActive();
        this.avatar = staff.getAvatar();
        this.role = staff.getAccount().getRole().getName();

    }
}