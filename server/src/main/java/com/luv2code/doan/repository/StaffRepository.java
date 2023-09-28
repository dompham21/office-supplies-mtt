package com.luv2code.doan.repository;

import com.luv2code.doan.entity.Customer;
import com.luv2code.doan.entity.Role;
import com.luv2code.doan.entity.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, String> {
    @Query("Select c from Staff  c where c.account.email = :email")
    public Staff getStaffByEmail(String email);

    @Query("SELECT u FROM Staff u WHERE (u.name LIKE %:keyword% OR u.phone LIKE %:keyword% OR u.account.email LIKE %:keyword%)")
    public Page<Staff> getListStaffsAdminWithKeyword(String keyword, Pageable pageable);

    @Query("SELECT u FROM Staff u")
    public Page<Staff> getListStaffsAdmin( Pageable pageable);

    @Query("SELECT u FROM Staff u WHERE " +
            "(u.name LIKE %:keyword% OR u.phone LIKE %:keyword% OR u.account.email LIKE %:keyword%)" +
            "AND u.account.isActive in :status")
    public Page<Staff> getListStaffsAdminWithKeywordAndStatus(String keyword, List<Boolean> status, Pageable pageable);

    @Query("SELECT u FROM Staff u WHERE u.account.isActive in :status")
    public Page<Staff> getListStaffsAdminAndStatus(List<Boolean> status, Pageable pageable);

    boolean existsById(String id);

    @Query("Select c from Staff  c where c.id = :id")
    public Staff getStaffById(String id);

    @Query("SELECT s FROM Staff s WHERE s.account.role.id = 3")
    public Page<Staff> getListShipper( Pageable pageable);

    @Query("SELECT s FROM Staff s WHERE s.account.role.id = 3 AND (s.name LIKE %:keyword% OR s.id LIKE %:keyword% OR s.account.email LIKE %:keyword%)")
    public Page<Staff> getListShipperWithKeyword(String keyword, Pageable pageable);

    @Query("SELECT count(o.id) FROM Order o WHERE o.staffDelivery.id = :id AND o.status.id = 3")
    public int numberDeliveringOfShipper(String id);


    public int countStaffByAccount_Role(Role role);
}
