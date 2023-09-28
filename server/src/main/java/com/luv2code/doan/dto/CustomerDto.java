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
public class CustomerDto {
    private String id;

    private String email;

    private String name;

    private String phone;

    private Date registrationDate;

    private Boolean isActive;

    private String avatar;

    private Date birthday;
    private String gender;
    private String address;




    public CustomerDto(Customer customer) {
        this.id = String.valueOf(customer.getId());
        this.email = customer.getAccount().getEmail();
        this.name = customer.getName();
        this.phone = customer.getPhone();
        this.registrationDate = customer.getRegistrationDate();
        this.isActive = customer.getAccount().getIsActive();
        this.avatar = customer.getAvatar();
        this.birthday = customer.getBirthday();
        this.gender = customer.getGender();
        this.address = customer.getAddress();

    }
}