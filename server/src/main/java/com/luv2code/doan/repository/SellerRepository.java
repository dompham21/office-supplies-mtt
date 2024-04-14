package com.luv2code.doan.repository;

import com.luv2code.doan.dto.SellerDto;
import com.luv2code.doan.entity.Customer;
import com.luv2code.doan.entity.Seller;
import io.swagger.models.auth.In;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SellerRepository extends JpaRepository<Seller, Integer> {
    @Query("Select c from Seller  c where c.account.email = :email")
    public Seller getSellerByEmail(String email);

    @Query("SELECT u FROM Seller u WHERE (u.name LIKE %:keyword% OR u.phone LIKE %:keyword% OR u.account.email LIKE %:keyword%)")
    public Page<Seller> getListSellersAdminWithKeyword(String keyword, Pageable pageable);

    @Query("SELECT u FROM Seller u")
    public Page<Seller> getListSellersAdmin( Pageable pageable);

    @Query("SELECT u FROM Seller u WHERE " +
            "(u.name LIKE %:keyword% OR u.phone LIKE %:keyword% OR u.account.email LIKE %:keyword%)" +
            "AND u.account.isActive in :status")
    public Page<Seller> getListSellersAdminWithKeywordAndStatus(String keyword,List<Boolean> status, Pageable pageable);

    @Query("SELECT u FROM Seller u WHERE u.account.isActive in :status")
    public Page<Seller> getListSellersAdminAndStatus(List<Boolean> status, Pageable pageable);

    public Seller getSellerById(Integer id);

    public boolean existsByPhone(String phone);
}
