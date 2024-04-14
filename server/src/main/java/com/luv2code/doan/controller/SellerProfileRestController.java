package com.luv2code.doan.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.luv2code.doan.dto.UserDto;
import com.luv2code.doan.entity.Seller;
import com.luv2code.doan.entity.Staff;
import com.luv2code.doan.exceptions.*;
import com.luv2code.doan.principal.UserPrincipal;
import com.luv2code.doan.response.UserResponse;
import com.luv2code.doan.service.AccountService;
import com.luv2code.doan.service.SellerService;
import com.luv2code.doan.service.StaffService;
import com.luv2code.doan.service.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.util.Date;

@RestController
@RequestMapping("/api/seller/profile")
@RequiredArgsConstructor
@Slf4j
public class SellerProfileRestController {
    @Autowired
    private SellerService sellerService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    private ResponseEntity<?> getProfile(Authentication authentication, HttpServletRequest request) throws NotFoundException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Seller seller = sellerService.getSellerByEmail(userPrincipal.getEmail());

        UserDto userDto = new UserDto(seller);
        UserResponse result = new UserResponse(1, "Get info a profile successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                userDto
        );

        return new ResponseEntity(result, HttpStatus.OK);
    }
}
