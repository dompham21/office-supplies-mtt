package com.luv2code.doan.repository;

import com.luv2code.doan.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    @Query("Select c from Customer  c where c.account.email = :email")
    public Customer getCustomerByEmail(String email);

    @Query("SELECT u FROM Customer u WHERE (u.name LIKE %:keyword% OR u.phone LIKE %:keyword% OR u.account.email LIKE %:keyword%)")
    public Page<Customer> getListCustomersAdminWithKeyword(String keyword, Pageable pageable);

    @Query("SELECT u FROM Customer u")
    public Page<Customer> getListCustomersAdmin( Pageable pageable);

    @Query("SELECT u FROM Customer u WHERE " +
            "(u.name LIKE %:keyword% OR u.phone LIKE %:keyword% OR u.account.email LIKE %:keyword%)" +
            "AND u.account.isActive in :status")
    public Page<Customer> getListCustomersAdminWithKeywordAndStatus(String keyword,List<Boolean> status, Pageable pageable);

    @Query("SELECT u FROM Customer u WHERE u.account.isActive in :status")
    public Page<Customer> getListCustomersAdminAndStatus(List<Boolean> status, Pageable pageable);

    @Query("Select c from Customer  c where c.id = :id")
    public Customer getCustomerById(Integer id);

    public boolean existsByPhone(String phone);
}
