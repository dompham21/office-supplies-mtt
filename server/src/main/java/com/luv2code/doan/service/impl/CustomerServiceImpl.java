package com.luv2code.doan.service.impl;

import com.luv2code.doan.entity.Customer;
import com.luv2code.doan.exceptions.NotFoundException;
import com.luv2code.doan.repository.CustomerRepository;
import com.luv2code.doan.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@RequiredArgsConstructor
@Service
@Transactional
@Slf4j
public class CustomerServiceImpl implements CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public Customer getCustomerByEmail(String email) throws NotFoundException {
        Customer customer = customerRepository.getCustomerByEmail(email);
        if(customer == null) {
            throw new NotFoundException("Could not find any customer with email " + email);
        }
        return customer;
    }

    @Override
    public Customer getCustomerById(Integer id) throws NotFoundException {
        Customer customer = customerRepository.getCustomerById(id);
        if(customer == null) {
            throw new NotFoundException("Could not find any customer with id " + id);
        }
        return customer;
    }

    public boolean existsByPhone(String phone) {
        return customerRepository.existsByPhone(phone);
    }

    @Override
    public void approveCustomer(Integer id) throws NotFoundException {
        try {
            Customer customer = customerRepository.findById(id).get();
            customer.getAccount().setIsActive(true);
            customerRepository.save(customer);

        }
        catch(NoSuchElementException ex) {
            throw new NotFoundException("Could not find any staff with ID " + id);
        }
    }

    @Override
    public void deleteCustomer(Integer id) throws NotFoundException {
        try {
            Customer customer = customerRepository.findById(id).get();
            customer.getAccount().setIsActive(false);
            customerRepository.save(customer);

        }
        catch(NoSuchElementException ex) {
            throw new NotFoundException("Could not find any staff with ID " + id);
        }
    }

    @Override
    public Page<Customer> getListCustomersAdmin(int pageNo, int pageSize, String sortField, String sortDirection, String keyword, List<Boolean> status) {
        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortField).ascending() : Sort.by(sortField).descending() ;
        Pageable pageable = PageRequest.of(pageNo -1, pageSize,sort);
        boolean hasKeyword = keyword != null && !keyword.isEmpty();
        if(status != null) {
            if (hasKeyword) {
                return customerRepository.getListCustomersAdminWithKeywordAndStatus(keyword, status, pageable);
            }
            else {
                return customerRepository.getListCustomersAdminAndStatus(status, pageable);
            }
        }
        else {
            if (hasKeyword) {
                return customerRepository.getListCustomersAdminWithKeyword(keyword, pageable);
            }
            else {
                return customerRepository.getListCustomersAdmin(pageable);
            }
        }

    }
}
