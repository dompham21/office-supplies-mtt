package com.luv2code.doan.service;

import com.luv2code.doan.entity.Account;
import com.luv2code.doan.entity.Seller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private OTPService otpService;
    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private org.thymeleaf.spring5.SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void sendVerificationSellerEmail(Seller seller)
            throws UnsupportedEncodingException, MessagingException {
        String subject = "Vui lòng xác thực tài khoản";
        String senderName = "PickBazar Team";

        String code = String.valueOf(otpService.generateOTP(seller.getAccount().getEmail()));

        Map<String, Object> model = new HashMap<String, Object>();
        model.put("code", code);
        model.put("name", seller.getName());
        Context context = new Context();
        context.setVariables(model);

        String html = templateEngine.process("email/verify-code", context);

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(senderEmail, senderName);
        helper.setTo(seller.getAccount().getEmail());
        helper.setSubject(subject);
        helper.setText(html, true);
        emailSender.send(message);
    }

    public void sendEmailForgotPassword(Account account)
            throws UnsupportedEncodingException, MessagingException {
        String subject = "Vui lòng xác thực tài khoản";
        String senderName = "ShopWise Team";

        String code = String.valueOf(otpService.generateOTP(account.getEmail()+ otpService.KEY_FORGOT));

        Map<String, Object> model = new HashMap<String, Object>();
        model.put("code", code);
        model.put("name", account.getEmail());
        Context context = new Context();
        context.setVariables(model);

        String html = templateEngine.process("email/verify-code", context);

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(senderEmail, senderName);
        helper.setTo(account.getEmail());
        helper.setSubject(subject);
        helper.setText(html, true);
        emailSender.send(message);
    }
}