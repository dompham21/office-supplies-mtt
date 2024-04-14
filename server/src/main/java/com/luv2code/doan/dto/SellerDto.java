package com.luv2code.doan.dto;

import com.luv2code.doan.entity.Customer;
import com.luv2code.doan.entity.Seller;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SellerDto {
    private String id;

    private String email;

    private String name;

    private String phone;

    private Date registrationDate;

    private Boolean isActive;
    private Boolean isEnabled;
    private String avatar;
    private String gender;
    private String address;




    public SellerDto(Seller seller) {
        this.id = String.valueOf(seller.getId());
        this.email = seller.getAccount().getEmail();
        this.name = seller.getName();
        this.phone = seller.getPhone();
        this.registrationDate = seller.getRegistrationDate();
        this.isActive = seller.getAccount().getIsActive();
        this.avatar = seller.getAvatar();
        this.gender = seller.getGender();
        this.address = seller.getAddress();
        this.isEnabled = seller.getIsEnabled();

    }
}