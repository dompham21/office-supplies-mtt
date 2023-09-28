package com.luv2code.doan.service;

import com.luv2code.doan.entity.Account;
import com.luv2code.doan.exceptions.NotFoundException;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;

public interface PaypalService {
    public Payment executePayment(String paymentId, String payerId) throws PayPalRESTException;
    public Payment createPayment(
            Double total,
            String currency,
            String method,
            String intent,
            String description,
            String cancelUrl,
            String successUrl
    ) throws PayPalRESTException;
}
