package com.luv2code.doan.controller;

import com.luv2code.doan.dto.CustomerDto;
import com.luv2code.doan.dto.OrderDto;
import com.luv2code.doan.dto.ShipperDto;
import com.luv2code.doan.dto.StaffDto;
import com.luv2code.doan.entity.*;
import com.luv2code.doan.exceptions.DuplicateException;
import com.luv2code.doan.exceptions.NotFoundException;
import com.luv2code.doan.request.SignupAdminRequestBody;
import com.luv2code.doan.response.*;
import com.luv2code.doan.service.AccountService;
import com.luv2code.doan.service.RoleService;
import com.luv2code.doan.service.StaffService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/staff")
@RequiredArgsConstructor
@Slf4j
public class AdminStaffRestController {
    @Autowired
    private StaffService staffService;

    @Autowired
    private AccountService accountService;
    @Autowired
    private RoleService roleService;
    @Autowired
    private  PasswordEncoder passwordEncoder;


    @RequestMapping(value = "/shipper", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> getListShipper(@RequestParam(value = "keyword", required = false) Optional<String> pKeyword,
                                            HttpServletRequest request) throws NotFoundException {
        String keyword = null;
        if (pKeyword.isPresent()) {
            keyword = pKeyword.get();
        }

        Page page = staffService.getListShipperWithKeyword(keyword, 1);
        List<Staff> staffList = page.getContent();
        List<ShipperDto> listShiperDto = new ArrayList<>();

        for(Staff staff : staffList) {
            ShipperDto shipperDto = new ShipperDto(staff, staffService.numberDeliveringOfShipper(staff.getId()));
            listShiperDto.add(shipperDto);
        }

        listShiperDto = listShiperDto.stream()
                .sorted(Comparator.comparingDouble(ShipperDto::getNumberDelivering))
                .collect(Collectors.toList());

        ListShipperResponse result = new ListShipperResponse(1, "Get list shipper successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listShiperDto
        );

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/update/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> update(@RequestBody @Valid SignupAdminRequestBody body, @PathVariable String id, HttpServletRequest request) throws DuplicateException, NotFoundException {
        Staff staff = staffService.getStaffById(id);

        Account account = accountService.getAccountByEmail(staff.getAccount().getEmail());
        String hashPass = passwordEncoder.encode(body.getPassword());
        account.setPassword(hashPass);
        account.setIsActive(body.getIsActive());

        Role roleAdmin = roleService.getRoleByName("ADMIN");

        // Just set role admin or sale for staff
        if(body.getRoleId().equals(roleAdmin.getId())) {
            Role role = roleService.getRoleByID(body.getRoleId());
            account.setRole(role);
        }

        staff.setAvatar(body.getAvatar());
        staff.setName(body.getName());
        staff.setAddress(body.getAddress());
        staff.setGender(body.getGender());
        staff.setId(body.getId());
        staff.setPhone(body.getPhone());

        Staff staffAfterSave = staffService.saveStaff(staff);


        StaffDto userDto = new StaffDto(staffAfterSave);

        StaffResponse result = new StaffResponse(1, "Your account has been updated successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                userDto);

        return new ResponseEntity(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<?> deleteStaff(@PathVariable String id, HttpServletRequest request) throws NotFoundException {

        staffService.deleteStaff(id);

        BaseResponse result = new BaseResponse(1, "Delete staff successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/approve/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> approveStaff(@PathVariable String id, HttpServletRequest request) throws NotFoundException {

        staffService.approveStaff(id);

        BaseResponse result = new BaseResponse(1, "Approve staff successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ListCustomerResponse> findStaffsAdmin(
            @RequestParam(value = "status", required = false) Optional<List<Boolean>> pStatus,
            @RequestParam(value = "role", required = false) Optional<List<String>> pRole,
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

        Page page = staffService.getListStaffsAdmin(pageNo, pageSize, sortField, sortDirection, keyword, status);
        List<Staff> staffs = page.getContent();
        int totalPage = page.getTotalPages();


        List<StaffDto> listStaffsDto = new ArrayList<>();
        for(Staff u : staffs) {
            listStaffsDto.add(new StaffDto(u));
        }

        if(pRole.isPresent()) {
            listStaffsDto = listStaffsDto.stream()
                    .filter(staff -> pRole.get().contains(staff.getRole()))
                    .collect(Collectors.toList());
        }



        ListStaffResponse result = new ListStaffResponse(1, "Get list users successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                listStaffsDto, totalPage, pageNo
        );

        return new ResponseEntity(result, HttpStatus.OK);

    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<StaffResponse> getStaffById(@PathVariable String id, HttpServletRequest request) throws NotFoundException {
        Staff staff = staffService.getStaffById(id);
        StaffDto userDto = new StaffDto(staff);

        StaffResponse result = new StaffResponse(1, "Get user successfully!", request.getMethod(), new Date().getTime(),
                HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(), userDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
