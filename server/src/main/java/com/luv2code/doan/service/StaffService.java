package com.luv2code.doan.service;

import com.luv2code.doan.entity.Customer;
import com.luv2code.doan.entity.Role;
import com.luv2code.doan.entity.Staff;
import com.luv2code.doan.exceptions.NotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface StaffService {
    public Staff saveStaff(Staff staff);
    public Staff getStaffByEmail(String email) throws NotFoundException;
    public Staff getStaffById(String id) throws NotFoundException;
    public Boolean existsById(String id);
    public void approveStaff(String id) throws NotFoundException;
    public void deleteStaff(String id) throws NotFoundException;
    public int numberDeliveringOfShipper(String id) throws NotFoundException;
    public Page<Staff> getListShipperWithKeyword(String keyword, Integer pageNo);
    public Page<Staff> getListStaffsAdmin(int pageNo, int pageSize, String sortField, String sortDirection, String keyword, List<Boolean> status);
    public int countStaffByAccount_Role(Role role);
}
