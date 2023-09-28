package com.luv2code.doan.service.impl;

import com.luv2code.doan.entity.Account;
import com.luv2code.doan.entity.Invoice;
import com.luv2code.doan.entity.Order;
import com.luv2code.doan.exceptions.NotFoundException;
import com.luv2code.doan.principal.UserPrincipal;
import com.luv2code.doan.repository.AccountRepository;
import com.luv2code.doan.repository.InvoiceRepository;
import com.luv2code.doan.service.AccountService;
import com.luv2code.doan.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
@Transactional
@Slf4j
public class InvoiceServiceImpl implements InvoiceService {
    @Autowired
    private InvoiceRepository invoiceRepository;


    @Override
    public Invoice getInvoiceByOrder(Order order) {
        return invoiceRepository.getInvoiceByOrder(order);
    }

    @Override
    public boolean existsInvoiceById(String id) {
        return invoiceRepository.existsInvoiceById(id);
    }

    @Override
    public Invoice saveInvoice(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }
}
