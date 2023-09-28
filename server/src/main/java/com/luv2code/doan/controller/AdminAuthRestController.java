package com.luv2code.doan.controller;

import com.luv2code.doan.bean.Token;
import com.luv2code.doan.dto.StaffDto;
import com.luv2code.doan.dto.UserDto;
import com.luv2code.doan.entity.Account;
import com.luv2code.doan.entity.Customer;
import com.luv2code.doan.entity.Role;
import com.luv2code.doan.entity.Staff;
import com.luv2code.doan.exceptions.DuplicateException;
import com.luv2code.doan.exceptions.NotFoundException;
import com.luv2code.doan.exceptions.ProductNotFoundException;
import com.luv2code.doan.request.SignupAdminRequestBody;
import com.luv2code.doan.request.SignupRequestBody;
import com.luv2code.doan.response.BaseResponse;
import com.luv2code.doan.response.SignupResponse;
import com.luv2code.doan.response.StaffResponse;
import com.luv2code.doan.service.AccountService;
import com.luv2code.doan.service.CustomerService;
import com.luv2code.doan.service.RoleService;
import com.luv2code.doan.service.StaffService;
import com.luv2code.doan.utils.TokenUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Date;

@RestController
@RequestMapping("/api/admin/staff/")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class AdminAuthRestController {
    private final AccountService accountService;
    private final RoleService roleService;
    private final StaffService staffService;

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final String defaultAvatar = "https://res.cloudinary.com/dmriwkfll/image/upload/v1656155271/f0w0qgwpe8wxo1ceafhm.jpg";

    @RequestMapping(value = "/signup", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> signup(@RequestBody @Valid SignupAdminRequestBody body, HttpServletRequest request) throws DuplicateException, NotFoundException {
        if (accountService.existsByEmail(body.getEmail())) {
            throw new DuplicateException("This email address is already being used");
        }

        if(staffService.existsById(body.getId())) {
            throw new DuplicateException("This id is already being used");
        }

        log.info("AuthController body send email: " + body.getEmail());

        Account account = new Account();
        String hashPass = passwordEncoder.encode(body.getPassword());

        account.setEmail(body.getEmail());
        account.setPassword(hashPass);
        account.setIsActive(true);

        Role role = roleService.getRoleByID(body.getRoleId());
        account.setRole(role);

        Account accountAfterSave = accountService.saveAccount(account);

        Staff staff = new Staff();
        staff.setAccount(accountAfterSave);
        staff.setAvatar(body.getAvatar());
        staff.setName(body.getName());
        staff.setAddress(body.getAddress());
        staff.setGender(body.getGender());
        staff.setId(body.getId());
        staff.setPhone(body.getPhone());
        staff.setRegistrationDate(new Date());

        Staff staffAfterSave = staffService.saveStaff(staff);

        TokenUtils tokenUtils = new TokenUtils();
        Token token = tokenUtils.generateToken(accountAfterSave, request);

        UserDto userDto = new UserDto(staffAfterSave);

        SignupResponse result = new SignupResponse(1, "Your account has been created successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.CREATED.getReasonPhrase(), HttpStatus.CREATED.value(),
                userDto, token.getAccessToken(), token.getRefreshToken());

        return new ResponseEntity(result, HttpStatus.CREATED);
    }




}
