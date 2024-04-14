package com.luv2code.doan.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.luv2code.doan.bean.Token;
import com.luv2code.doan.dto.UserDto;
import com.luv2code.doan.entity.*;
import com.luv2code.doan.exceptions.ConfirmPasswordDifferentException;
import com.luv2code.doan.exceptions.DuplicateException;
import com.luv2code.doan.exceptions.NotFoundException;
import com.luv2code.doan.exceptions.UserNotFoundException;
import com.luv2code.doan.principal.UserPrincipal;
import com.luv2code.doan.request.*;
import com.luv2code.doan.response.BaseResponse;
import com.luv2code.doan.response.OtpResponse;
import com.luv2code.doan.response.SignupResponse;
import com.luv2code.doan.service.*;
import com.luv2code.doan.utils.MessageErrorMap;
import com.luv2code.doan.utils.TokenUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class AuthRestController {
    private final AccountService accountService;
    private final RoleService roleService;
    private final CustomerService customerService;
    private final StaffService staffService;

    @Autowired
    private SellerService sellerService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OTPService otpService;

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final String defaultAvatar = "https://res.cloudinary.com/dmriwkfll/image/upload/v1656155271/f0w0qgwpe8wxo1ceafhm.jpg";

    @RequestMapping(value = "/signup", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> signup(@RequestBody @Valid SignupRequestBody body, HttpServletRequest request) throws DuplicateException, NotFoundException {
        if (accountService.existsByEmail(body.getEmail())) {
            throw new DuplicateException(MessageErrorMap.DUPLICATE_EMAIL);
        }

        log.info("AuthController body send email: " + body.getEmail());

        Account account = new Account();
        String hashPass = passwordEncoder.encode(body.getPassword());

        account.setEmail(body.getEmail());
        account.setPassword(hashPass);
        Role role = roleService.getRoleByName("USER");
        account.setRole(role);
        account.setIsActive(false);

        Account accountAfterSave = accountService.saveAccount(account);

        Customer customer = new Customer();
        customer.setAccount(accountAfterSave);
        customer.setAvatar(defaultAvatar);
        customer.setName(body.getName());
        customer.setRegistrationDate(new Date());
        customer.setPhone(body.getPhone());

        Customer customerAfterSave = customerService.saveCustomer(customer);

        TokenUtils tokenUtils = new TokenUtils();
        Token token = tokenUtils.generateToken(accountAfterSave, request);

        UserDto userDto = new UserDto(customerAfterSave);
        SignupResponse result = new SignupResponse(1, "Your account has been created successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.CREATED.getReasonPhrase(), HttpStatus.CREATED.value(),
                userDto, token.getAccessToken(), token.getRefreshToken());

        return new ResponseEntity(result, HttpStatus.CREATED);
    }




    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) throws UserNotFoundException, NotFoundException {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
        Account account = accountService.getAccountByEmail(userDetails.getEmail());

        TokenUtils tokenUtils = new TokenUtils();
        Token token = tokenUtils.generateToken(account, request);

        Customer customer = customerService.getCustomerByEmail(userDetails.getEmail());
        UserDto userDto = new UserDto(customer);

        SignupResponse result = new SignupResponse(1, "Your account has been logged successfully!",
                request.getMethod(),new Date().getTime(),HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                userDto, token.getAccessToken(), token.getRefreshToken());
        return new ResponseEntity(result, HttpStatus.OK);

    }

    @PostMapping("/login/staff")
    public ResponseEntity<?> authenticateAdmin(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) throws UserNotFoundException, NotFoundException {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
        Account account = accountService.getAccountByEmail(userDetails.getEmail());


        Role role = account.getRole();
        Role roleAdmin = roleService.getRoleByID(1);
        if(!role.equals(roleAdmin)) {
            throw  new NotFoundException("Bạn không không đủ thẩm quyền để đăng nhập trang quản trị!");
        }

        TokenUtils tokenUtils = new TokenUtils();
        Token token = tokenUtils.generateToken(account, request);

        Staff staff = staffService.getStaffByEmail(userDetails.getEmail());
        UserDto userDto = new UserDto(staff);

        SignupResponse result = new SignupResponse(1, "Your account has been logged successfully!",
                request.getMethod(),new Date().getTime(),HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                userDto, token.getAccessToken(), token.getRefreshToken());
        return new ResponseEntity(result, HttpStatus.OK);

    }

    @PostMapping("/login/shipper")
    public ResponseEntity<?> authenticateShipper(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) throws UserNotFoundException, NotFoundException {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
        Account account = accountService.getAccountByEmail(userDetails.getEmail());


        Role role = account.getRole();
        Role roleAdmin = roleService.getRoleByID(3);
        if(!role.equals(roleAdmin)) {
            throw  new NotFoundException("Bạn không không đủ thẩm quyền để đăng nhập trang của shipper!");
        }

        TokenUtils tokenUtils = new TokenUtils();
        Token token = tokenUtils.generateToken(account, request);

        Staff staff = staffService.getStaffByEmail(userDetails.getEmail());
        UserDto userDto = new UserDto(staff);

        SignupResponse result = new SignupResponse(1, "Your account has been logged successfully!",
                request.getMethod(),new Date().getTime(),HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                userDto, token.getAccessToken(), token.getRefreshToken());
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @PostMapping("/login/seller")
    public ResponseEntity<?> authenticateSeller(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) throws UserNotFoundException, NotFoundException {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
        Account account = accountService.getAccountByEmail(userDetails.getEmail());


        Role role = account.getRole();
        Role roleAdmin = roleService.getRoleByID(3);

        Seller seller = sellerService.getSellerByEmail(userDetails.getEmail());

        if(!role.equals(roleAdmin)) {
            throw  new NotFoundException("Bạn không không đủ thẩm quyền để đăng nhập trang của seller!");
        }
        else if(!seller.getIsEnabled()) {
            throw  new NotFoundException("Vui lòng chờ người quản lý duyệt!");
        }
        TokenUtils tokenUtils = new TokenUtils();
        Token token = tokenUtils.generateToken(account, request);
        UserDto userDto = new UserDto(seller);

        SignupResponse result = new SignupResponse(1, "Your account has been logged successfully!",
                request.getMethod(),new Date().getTime(),HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                userDto, token.getAccessToken(), token.getRefreshToken());
        return new ResponseEntity(result, HttpStatus.OK);

    }

    @RequestMapping(value = "/signup/seller", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @Transactional
    public ResponseEntity<?> signupSeller(@RequestBody @Valid SignupRequestBody body, HttpServletRequest request) throws DuplicateException, NotFoundException, UnsupportedEncodingException, MessagingException {
        if (accountService.existsByEmail(body.getEmail())) {
            throw new DuplicateException(MessageErrorMap.DUPLICATE_EMAIL);
        }

        log.info("AuthController body send email: " + body.getEmail());
        Account account = new Account();
        String hashPass = passwordEncoder.encode(body.getPassword());

        account.setEmail(body.getEmail());
        account.setPassword(hashPass);
        account.setRole(roleService.getRoleByName("SELLER"));
        account.setIsActive(false);

        Account accountAfterSave = accountService.saveAccount(account);

        Seller seller = new Seller();
        seller.setAccount(accountAfterSave);
        seller.setAvatar(defaultAvatar);
        seller.setName(body.getName());
        seller.setRegistrationDate(new Date());
        seller.setPhone(body.getPhone());
        seller.setIsEnabled(false);

        Seller sellerAfterSave = sellerService.saveSeller(seller);
        emailService.sendVerificationSellerEmail(seller);

        TokenUtils tokenUtils = new TokenUtils();
        Token token = tokenUtils.generateToken(accountAfterSave, request);

        UserDto userDto = new UserDto(sellerAfterSave);
        SignupResponse result = new SignupResponse(1, "Your account has been created successfully! Please check your mail to verify!",
                request.getMethod(), new Date().getTime(), HttpStatus.CREATED.getReasonPhrase(), HttpStatus.CREATED.value(),
                userDto, token.getAccessToken(), token.getRefreshToken());

        return new ResponseEntity(result, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/signup/verify", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> verifySellerSignup(@RequestBody @Valid OTPRequest body, HttpServletRequest request) throws NotFoundException {


        Account account = accountService.getAccountByEmail(body.getUsername());


        if(body.getOtp() != otpService.getOtp(account.getEmail())) {
            BaseResponse result = new BaseResponse(0, "Sorry, we could not verify account. It maybe already verified or verification code is incorrect.",
                    request.getMethod(), new Date().getTime(), HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST.value());

            return new ResponseEntity(result, HttpStatus.BAD_REQUEST);
        }
        account.setIsActive(true);
        accountService.saveAccount(account);

        BaseResponse result = new BaseResponse(1, "Congratulations, your account has been verified.",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());

        return new ResponseEntity(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/seller/resend", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> resendSellerSignup(@RequestBody @Valid OTPRequest body, HttpServletRequest request) throws NotFoundException, UnsupportedEncodingException, MessagingException {


        Account account = accountService.getAccountByEmail(body.getUsername());
        Seller seller = sellerService.getSellerByEmail(account.getEmail());
        otpService.clearOTP(account.getEmail());
        emailService.sendVerificationSellerEmail(seller);

        BaseResponse result = new BaseResponse(1, "Resend mail successfully",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());

        return new ResponseEntity(result, HttpStatus.OK);
    }

    @GetMapping("/token/refresh")
    public ResponseEntity<Object> refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String authorizationHeader = request.getHeader("Authorization");
        if(authorizationHeader != null && authorizationHeader.startsWith("Bearer ")){
            try{
                String refreshToken = authorizationHeader.substring("Bearer ".length());
                TokenUtils tokenUtils = new TokenUtils();

                DecodedJWT decodedJWT = tokenUtils.decodedToken(refreshToken);

                String email = decodedJWT.getSubject();

                Account user = accountService.getAccountByEmail(email);

                Token token = tokenUtils.refreshAccessToken(user, refreshToken, request);

                Map<String, Object> tokens = new LinkedHashMap<>();
                tokens.put("result", 1);
                tokens.put("method", "GET");
                tokens.put("msg","Your token has been refresh successfully!");
                tokens.put("timestamp", new Date().getTime());
                tokens.put("accessToken", token.getAccessToken());
                tokens.put("refreshToken", token.getRefreshToken());
                tokens.put("status", HttpStatus.OK.getReasonPhrase());
                tokens.put("code", HttpStatus.OK.value());
                return new ResponseEntity(tokens, HttpStatus.OK);

            }
            catch (Exception e){
                response.setHeader("error", e.getMessage());
                Map<String, Object> errors = new HashMap<>();
                errors.put("method", request.getMethod());
                errors.put("timestamp", new Date().getTime());
                errors.put("status", HttpStatus.BAD_REQUEST.getReasonPhrase());
                errors.put("msg", e.getMessage());
                errors.put("code", HttpStatus.BAD_REQUEST.value());
                return new ResponseEntity(errors, HttpStatus.BAD_REQUEST);

            }
        }
        else {
            throw new RuntimeException("Refresh token is missing");
        }
    }

    @RequestMapping(value = "/forgot/password", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> forgotPassword(@RequestBody @Valid ForgotPasswordRequest body, HttpServletRequest request) throws NotFoundException, UnsupportedEncodingException, MessagingException {
        Account account = accountService.getAccountByEmail(body.getEmail());

        otpService.clearOTP(account.getEmail() + otpService.KEY_FORGOT);
        otpService.clearOTP(account.getEmail() + otpService.KEY_FORGOT_VERIFY);

        emailService.sendEmailForgotPassword(account);

        BaseResponse result = new BaseResponse(1, "Send mail successfully",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());

        return new ResponseEntity(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/forgot/verify", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> verifyForgot(@RequestBody @Valid OTPRequest body, HttpServletRequest request) throws NotFoundException {


        Account account = accountService.getAccountByEmail(body.getUsername());


        if(body.getOtp() != otpService.getOtp(account.getEmail() + otpService.KEY_FORGOT)) {
            BaseResponse result = new BaseResponse(0, "Sorry, we could not verify account. It maybe already verified or verification code is incorrect.",
                    request.getMethod(), new Date().getTime(), HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST.value());

            return new ResponseEntity(result, HttpStatus.BAD_REQUEST);
        }

        int otp = otpService.generateOTP(account.getEmail() + otpService.KEY_FORGOT_VERIFY);

        OtpResponse result = new OtpResponse(1, "Congratulations, your account has been verified.",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                account.getEmail(), otp);

        return new ResponseEntity(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/forgot/resend", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> resendForgot(@RequestBody @Valid ForgotPasswordRequest body, HttpServletRequest request) throws NotFoundException, UnsupportedEncodingException, MessagingException {


        Account account = accountService.getAccountByEmail(body.getEmail());
        otpService.clearOTP(account.getEmail() + otpService.KEY_FORGOT);
        emailService.sendEmailForgotPassword(account);

        BaseResponse result = new BaseResponse(1, "Resend mail successfully",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value());

        return new ResponseEntity(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/forgot/confirm", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> confirmPassword(@RequestBody @Valid ChangePasswordForgotRequest body, HttpServletRequest request) throws NotFoundException, UnsupportedEncodingException, MessagingException {
        Account account = accountService.getAccountByEmail(body.getEmail());
        if(body.getOtp() != otpService.getOtp(account.getEmail() + otpService.KEY_FORGOT_VERIFY)) {
            BaseResponse result = new BaseResponse(0, "Sorry, we could not verify account. It maybe already verified or verification code is incorrect.",
                    request.getMethod(), new Date().getTime(), HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST.value());

            return new ResponseEntity(result, HttpStatus.BAD_REQUEST);
        }
        otpService.clearOTP(account.getEmail() + otpService.KEY_FORGOT_VERIFY);
        otpService.clearOTP(account.getEmail() + otpService.KEY_FORGOT);
        String encodePassword = passwordEncoder.encode(body.getNewPassword());

        account.setPassword(encodePassword);
        accountService.saveAccount(account);

        BaseResponse result = new BaseResponse(1, "Change password successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value()
        );

        return new ResponseEntity(result, HttpStatus.OK);
    }
}