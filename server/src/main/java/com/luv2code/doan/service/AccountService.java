package com.luv2code.doan.service;

import com.luv2code.doan.entity.Account;
import com.luv2code.doan.exceptions.NotFoundException;
import com.luv2code.doan.exceptions.UserNotFoundException;

public interface AccountService {
    public Boolean existsByEmail(String email);
    public Account getAccountByEmail(String email) throws NotFoundException;
    public Account saveAccount(Account account);
}
