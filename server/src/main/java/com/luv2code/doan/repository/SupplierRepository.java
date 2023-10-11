package com.luv2code.doan.repository;

import com.luv2code.doan.entity.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, String> {

    public List<Supplier> findByIsActive(Boolean isActive);

    @Query("SELECT S FROM Supplier S WHERE (S.name LIKE %:keyword%)")
    public Page<Supplier> findAllByKeyword(String keyword, Pageable pageable);

    @Query("SELECT s FROM Supplier s")
    public Page<Supplier> findAllAdmin(Pageable pageable);

    @Query("SELECT s FROM Supplier s WHERE s.id = :id")
    public Supplier findSupplierById(String id);

}
