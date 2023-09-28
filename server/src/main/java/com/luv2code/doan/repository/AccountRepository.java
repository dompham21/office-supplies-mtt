package com.luv2code.doan.repository;

import com.luv2code.doan.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    public Account getAccountByEmail(String email);

    Boolean existsByEmail(String email);

}
