package com.luv2code.doan.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.luv2code.doan.bean.SaleHistoryItem;
import com.luv2code.doan.bean.Token;
import com.luv2code.doan.dto.CustomerDto;
import com.luv2code.doan.dto.UserDto;
import com.luv2code.doan.entity.Account;
import com.luv2code.doan.entity.Customer;
import com.luv2code.doan.exceptions.*;
import com.luv2code.doan.principal.UserPrincipal;
import com.luv2code.doan.request.*;
import com.luv2code.doan.response.BaseResponse;
import com.luv2code.doan.response.CustomerResponse;
import com.luv2code.doan.response.UserResponse;
import com.luv2code.doan.service.AccountService;
import com.luv2code.doan.service.CustomerService;
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
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Slf4j
public class ProfileRestController {
    @Autowired
    private CustomerService customerService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private StorageService storageService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @RequestMapping(value = "/change", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    private ResponseEntity<?> changeInfo(Authentication authentication, @Valid @RequestBody ChangeInfoCustomerRequest changeInfoCustomerRequest, HttpServletRequest request) throws DuplicateException, NotFoundException, ParseException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Customer customer = customerService.getCustomerByEmail(userPrincipal.getEmail());
        Date birthDay = null;

        try {
            birthDay = new SimpleDateFormat("dd/MM/yyyy").parse(changeInfoCustomerRequest.getBirthday());
        } catch (ParseException e) {
            e.printStackTrace();
            throw new NotFoundException("Lỗi định dạng datetime!");
        }

        customer.setName(changeInfoCustomerRequest.getName());
        customer.setBirthday(birthDay);
        customer.setGender(changeInfoCustomerRequest.getGender());
        customer.setAddress(changeInfoCustomerRequest.getAddress());

        Customer customerAfterSave = customerService.saveCustomer(customer);
        UserDto userDto = new UserDto(customerAfterSave);

        UserResponse result = new UserResponse(1, "Change info a profile successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                userDto
        );

        return new ResponseEntity(result, HttpStatus.OK);
    }


    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    private ResponseEntity<?> getProfile(Authentication authentication, HttpServletRequest request) throws NotFoundException, UserNotFoundException, AddressNotFoundException, CartMoreThanProductInStock, ProductNotFoundException, JsonProcessingException, UnsupportedEncodingException, MessagingException, DuplicateException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Customer customer = customerService.getCustomerByEmail(userPrincipal.getEmail());

        CustomerDto userDto = new CustomerDto(customer);
        CustomerResponse result = new CustomerResponse(1, "Get info a profile successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                userDto
        );

        return new ResponseEntity(result, HttpStatus.OK);
    }


    @RequestMapping(value = "/avatar", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    private ResponseEntity<?> changeAvatar(Authentication authentication, @RequestParam(value = "file") MultipartFile part, HttpServletRequest request) throws IOException, NotFoundException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Customer customer = customerService.getCustomerByEmail(userPrincipal.getEmail());

        String url = storageService.upload(part);


        customer.setAvatar(url);

        Customer customerAfterSave = customerService.saveCustomer(customer);
        UserDto userDto = new UserDto(customerAfterSave);

        UserResponse result = new UserResponse(1, "Change avatar user successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                userDto
        );

        return new ResponseEntity(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/password", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    private ResponseEntity<?> changePassword(Authentication authentication, @Valid @RequestBody ChangePasswordRequest changePasswordRequest, HttpServletRequest request) throws NotFoundException, UserNotFoundException, AddressNotFoundException, CartMoreThanProductInStock, ProductNotFoundException, JsonProcessingException, UnsupportedEncodingException, MessagingException, DuplicateException, PasswordIncorrectException, OldPasswordSameNewPassword, ConfirmPasswordDifferentException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Account account = accountService.getAccountByEmail(userPrincipal.getEmail());

        if (!BCrypt.checkpw(changePasswordRequest.getOldPassword(), account.getPassword())) {
            throw new PasswordIncorrectException("The current password is incorrect!");
        }
        else if(changePasswordRequest.getOldPassword().equals(changePasswordRequest.getNewPassword())) {
            throw new OldPasswordSameNewPassword("The new password is the same as the old password!");
        }
        else if(!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirmPassword())) {
            throw new ConfirmPasswordDifferentException("The confirm password does not match the new password!");
        }

        String encodePassword = passwordEncoder.encode(changePasswordRequest.getNewPassword());

        account.setPassword(encodePassword);
        accountService.saveAccount(account);

        BaseResponse result = new BaseResponse(1, "Change password successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value()
        );

        return new ResponseEntity(result, HttpStatus.OK);
    }

}
