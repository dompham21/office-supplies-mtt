package com.luv2code.doan.service;

import com.luv2code.doan.entity.Customer;
import com.luv2code.doan.exceptions.NotFoundException;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CustomerService {
    public Customer saveCustomer(Customer customer);
    public Customer getCustomerByEmail(String email) throws NotFoundException;
    public Customer getCustomerById(Integer id) throws NotFoundException;
    public boolean existsByPhone(String phone);
    public void approveCustomer(Integer id) throws NotFoundException;
    public void deleteCustomer(Integer id) throws NotFoundException;

    public Page<Customer> getListCustomersAdmin(int pageNo, int pageSize, String sortField, String sortDirection, String keyword, List<Boolean> status);
}
