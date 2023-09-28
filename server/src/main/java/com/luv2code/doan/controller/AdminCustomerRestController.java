package com.luv2code.doan.controller;

import com.luv2code.doan.dto.CustomerDto;
import com.luv2code.doan.dto.UserDto;
import com.luv2code.doan.entity.Customer;
import com.luv2code.doan.exceptions.NotFoundException;
import com.luv2code.doan.response.*;
import com.luv2code.doan.service.CustomerService;
import com.luv2code.doan.service.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/customer")
@RequiredArgsConstructor
@Slf4j
public class AdminCustomerRestController {
    private final CustomerService customerService;

    @Autowired
    private RoleService roleService;

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<?> deleteCustomer(@PathVariable Integer id, HttpServletRequest request) throws NotFoundException {

        customerService.deleteCustomer(id);

        BaseResponse result = new BaseResponse(1, "Delete customer successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/approve/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> approveUser(@PathVariable Integer id, HttpServletRequest request) throws NotFoundException {

        customerService.approveCustomer(id);

        BaseResponse result = new BaseResponse(1, "Approve customer successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ListCustomerResponse> findCustomersAdmin(
            @RequestParam(value = "status", required = false) Optional<List<Boolean>> pStatus,
            @RequestParam(value = "pageNo", required = false) Optional<Integer> pPageNo,
            @RequestParam(value = "pageSize", required = false) Optional<Integer> pPageSize,
            @RequestParam(value = "sortField", required = false) Optional<String> pSortField,
            @RequestParam(value = "sortDirection", required = false) Optional<String> pSortDir,
            @RequestParam(value = "keyword", required = false) Optional<String> pKeyword,
            HttpServletRequest request) {
        int pageNo = 1;
        int pageSize = 10;
        String sortField = "id";
        String sortDirection = "ASC";
        String keyword = null;
        List<Boolean> status = null;

        if (pPageNo.isPresent()) {
            pageNo = pPageNo.get();
        }
        if (pPageSize.isPresent()) {
            pageSize = pPageSize.get();
        }
        if (pSortField.isPresent()) {
            String sortFieldTemp = pSortField.get();
            if(sortFieldTemp.trim().equals("registrationDate") || sortFieldTemp.trim().equals("id")
                    || sortFieldTemp.trim().equals("name")) {
                sortField = sortFieldTemp.trim();
            }
        }
        if (pSortDir.isPresent()) {
            String sortDirTemp = pSortDir.get();
            if(sortDirTemp.trim().equalsIgnoreCase("asc") || sortDirTemp.trim().equalsIgnoreCase("desc")) {
                sortDirection = sortDirTemp.trim();
            }
        }
        if (pKeyword.isPresent()) {
            keyword = pKeyword.get();
        }
        if(pStatus.isPresent()) {
            status = pStatus.get();
        }

        Page page = customerService.getListCustomersAdmin(pageNo, pageSize, sortField, sortDirection, keyword, status);
        List<Customer> customers = page.getContent();
        int totalPage = page.getTotalPages();


        List<CustomerDto> listUsersDto = new ArrayList<>();
        for(Customer u : customers) {
            listUsersDto.add(new CustomerDto(u));
        }



        ListCustomerResponse result = new ListCustomerResponse(1, "Get list users successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listUsersDto, totalPage, pageNo
        );

        return new ResponseEntity(result, HttpStatus.OK);

    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<CustomerResponse> getUserById(@PathVariable Integer id, HttpServletRequest request) throws NotFoundException {
        Customer user = customerService.getCustomerById(id);
        CustomerDto userDto = new CustomerDto(user);

        CustomerResponse result = new CustomerResponse(1, "Get user successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), userDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
