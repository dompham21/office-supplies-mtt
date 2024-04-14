package com.luv2code.doan.service;

import com.luv2code.doan.entity.Customer;
import com.luv2code.doan.entity.Seller;
import com.luv2code.doan.exceptions.NotFoundException;
import com.luv2code.doan.repository.CustomerRepository;
import com.luv2code.doan.repository.SellerRepository;
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
public class SellerService {
    @Autowired
    private SellerRepository sellerRepository;

    public Seller saveSeller(Seller seller) {
        return sellerRepository.save(seller);
    }

    public Seller getSellerByEmail(String email) throws NotFoundException {
        Seller seller = sellerRepository.getSellerByEmail(email);
        if(seller == null) {
            throw new NotFoundException("Could not find any seller with email " + email);
        }
        return seller;
    }

    public Seller getSellerById(Integer id) throws NotFoundException {
        Seller seller = sellerRepository.getSellerById(id);
        if(seller == null) {
            throw new NotFoundException("Could not find any seller with id " + id);
        }
        return seller;
    }

    public boolean existsByPhone(String phone) {
        return sellerRepository.existsByPhone(phone);
    }

    public void approveSeller(Integer id) throws NotFoundException {
        try {
            Seller seller = sellerRepository.findById(id).get();
            seller.getAccount().setIsActive(true);
            sellerRepository.save(seller);

        }
        catch(NoSuchElementException ex) {
            throw new NotFoundException("Could not find any seller with ID " + id);
        }
    }

    public void deleteSeller(Integer id) throws NotFoundException {
        try {
            Seller seller = sellerRepository.findById(id).get();
            seller.getAccount().setIsActive(false);
            sellerRepository.save(seller);

        }
        catch(NoSuchElementException ex) {
            throw new NotFoundException("Could not find any seller with ID " + id);
        }
    }

    public void unlockSeller(Integer id) throws NotFoundException {
        try {
            Seller seller = sellerRepository.findById(id).get();
            seller.setIsEnabled(true);
            sellerRepository.save(seller);

        }
        catch(NoSuchElementException ex) {
            throw new NotFoundException("Could not find any seller with ID " + id);
        }
    }

    public void lockSeller(Integer id) throws NotFoundException {
        try {
            Seller seller = sellerRepository.findById(id).get();
            seller.setIsEnabled(false);
            sellerRepository.save(seller);

        }
        catch(NoSuchElementException ex) {
            throw new NotFoundException("Could not find any seller with ID " + id);
        }
    }

    public Page<Seller> getListSellersAdmin(int pageNo, int pageSize, String sortField, String sortDirection, String keyword, List<Boolean> status) {
        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortField).ascending() : Sort.by(sortField).descending() ;
        Pageable pageable = PageRequest.of(pageNo -1, pageSize,sort);
        boolean hasKeyword = keyword != null && !keyword.isEmpty();
        if(status != null) {
            if (hasKeyword) {
                return sellerRepository.getListSellersAdminWithKeywordAndStatus(keyword, status, pageable);
            }
            else {
                return sellerRepository.getListSellersAdminAndStatus(status, pageable);
            }
        }
        else {
            if (hasKeyword) {
                return sellerRepository.getListSellersAdminWithKeyword(keyword, pageable);
            }
            else {
                return sellerRepository.getListSellersAdmin(pageable);
            }
        }

    }
}
