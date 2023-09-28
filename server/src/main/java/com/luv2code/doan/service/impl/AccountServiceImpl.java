package com.luv2code.doan.service.impl;

import com.luv2code.doan.entity.Account;
import com.luv2code.doan.exceptions.NotFoundException;
import com.luv2code.doan.principal.UserPrincipal;
import com.luv2code.doan.repository.AccountRepository;
import com.luv2code.doan.service.AccountService;
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
public class AccountServiceImpl implements AccountService, UserDetailsService {
    @Autowired
    private AccountRepository accountRepository;

    @Override
    public Boolean existsByEmail(String email) {
        return accountRepository.existsByEmail(email);
    }

    @Override
    public Account saveAccount(Account account) {
        return accountRepository.save(account);
    }

    @Override
    public Account getAccountByEmail(String email) throws NotFoundException {
        Account account = accountRepository.getAccountByEmail(email);
        if(account == null) {
            throw new NotFoundException("Không tìm thấy tài khoản có địa chỉ email là: " + email);
        }
        return account;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Username is: " + username );
        Account account = accountRepository.getAccountByEmail(username);
        if(account == null) {
            log.error("Account not found!");
            throw new UsernameNotFoundException("Account Not Found with username: " + username);
        }

        return UserPrincipal.build(account);
    }
}
