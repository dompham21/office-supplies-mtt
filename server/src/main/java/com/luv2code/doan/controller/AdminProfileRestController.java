package com.luv2code.doan.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.luv2code.doan.dto.UserDto;
import com.luv2code.doan.entity.Account;
import com.luv2code.doan.entity.Customer;
import com.luv2code.doan.entity.Staff;
import com.luv2code.doan.exceptions.*;
import com.luv2code.doan.principal.UserPrincipal;
import com.luv2code.doan.request.ChangeInfoCustomerRequest;
import com.luv2code.doan.request.ChangePasswordRequest;
import com.luv2code.doan.response.BaseResponse;
import com.luv2code.doan.response.UserResponse;
import com.luv2code.doan.service.AccountService;
import com.luv2code.doan.service.CustomerService;
import com.luv2code.doan.service.StaffService;
import com.luv2code.doan.service.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
@RequestMapping("/api/admin/profile")
@RequiredArgsConstructor
@Slf4j
public class AdminProfileRestController {
    @Autowired
    private StaffService staffService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private StorageService storageService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    private ResponseEntity<?> getProfile(Authentication authentication, HttpServletRequest request) throws NotFoundException, UserNotFoundException, AddressNotFoundException, CartMoreThanProductInStock, ProductNotFoundException, JsonProcessingException, UnsupportedEncodingException, MessagingException, DuplicateException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Staff staff = staffService.getStaffByEmail(userPrincipal.getEmail());

        UserDto userDto = new UserDto(staff);
        UserResponse result = new UserResponse(1, "Get info a profile successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                userDto
        );

        return new ResponseEntity(result, HttpStatus.OK);
    }



}
