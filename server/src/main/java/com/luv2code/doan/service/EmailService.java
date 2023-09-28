package com.luv2code.doan.service;

import com.luv2code.doan.entity.Customer;
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


public interface EmailService {

    public void sendVerificationEmail(Customer user)
            throws UnsupportedEncodingException, MessagingException;

    public void sendEmailForgotPassword(Customer user)
            throws UnsupportedEncodingException, MessagingException;
}
