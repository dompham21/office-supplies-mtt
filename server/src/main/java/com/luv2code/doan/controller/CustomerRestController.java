package com.luv2code.doan.controller;

import com.luv2code.doan.entity.Customer;
import com.luv2code.doan.exceptions.NotFoundException;
import com.luv2code.doan.service.AccountService;
import com.luv2code.doan.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class CustomerRestController {
    private final CustomerService customerService;
    private final AccountService accountService;

    @RequestMapping(value = "/id", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> getCustomerById(@PathVariable("id") Integer id) throws NotFoundException {
        Customer user = customerService.getCustomerById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}
