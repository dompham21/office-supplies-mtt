package com.luv2code.doan.service.impl;

import com.luv2code.doan.entity.Customer;
import com.luv2code.doan.entity.Product;
import com.luv2code.doan.entity.Role;
import com.luv2code.doan.entity.Staff;
import com.luv2code.doan.exceptions.NotFoundException;
import com.luv2code.doan.exceptions.ProductNotFoundException;
import com.luv2code.doan.repository.RoleRepository;
import com.luv2code.doan.repository.StaffRepository;
import com.luv2code.doan.service.StaffService;
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
public class StaffServiceImpl implements StaffService {
    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Staff saveStaff(Staff staff) {
        return staffRepository.save(staff);
    }

    @Override
    public Staff getStaffByEmail(String email) throws NotFoundException {
        Staff staff = staffRepository.getStaffByEmail(email);
        if(staff == null) {
            throw new NotFoundException("Không tìm thấy nhân viên với địa chỉ email:  " + email);
        }
        return staff;
    }

    @Override
    public Staff getStaffById(String id) throws NotFoundException {
        Staff staff = staffRepository.getStaffById(id);
        if(staff == null) {
            throw new NotFoundException("Không tìm thấy nhân viên với địa chỉ id:" + id);
        }
        return staff;
    }


    @Override
    public Boolean existsById(String id) {
        return staffRepository.existsById(id);
    }

    @Override
    public void deleteStaff(String id) throws NotFoundException {
        try {
            Staff staff = staffRepository.findById(id).get();
            Role role = roleRepository.getRoleByID(1);

            if(staff.getAccount().getRole().equals(role)) {
                int numberRoleAdmin = countStaffByAccount_Role(role);
                if(numberRoleAdmin <= 1) {
                    throw new NotFoundException("Không thể vô hiệu hoá tài khoản nhân viên quản lý cuối cùng trong hệ thống!");
                }
            }
            staff.getAccount().setIsActive(false);
            staffRepository.save(staff);

        }
        catch (NotFoundException e) {
            throw new NotFoundException("Không thể vô hiệu hoá tài khoản nhân viên quản lý cuối cùng trong hệ thống!");
        }
        catch(NoSuchElementException ex) {
            throw new NotFoundException("Could not find any staff with ID " + id);
        }
    }



    @Override
    public int numberDeliveringOfShipper(String id) throws NotFoundException {
        this.getStaffById(id);
        return staffRepository.numberDeliveringOfShipper(id);
    }

    @Override
    public Page<Staff> getListShipperWithKeyword(String keyword, Integer pageNo) {

        Pageable pageable = PageRequest.of(pageNo -1, 10);
        boolean hasKeyword = keyword != null && !keyword.isEmpty();
        if(hasKeyword) {
            return staffRepository.getListShipperWithKeyword(keyword, pageable);
        }
        else {
            return staffRepository.getListShipper(pageable);
        }
    }

    @Override
    public void approveStaff(String id) throws NotFoundException {
        try {
            Staff staff = staffRepository.findById(id).get();
            staff.getAccount().setIsActive(true);
            staffRepository.save(staff);

        }
        catch(NoSuchElementException ex) {
            throw new NotFoundException("Could not find any staff with ID " + id);
        }
    }

    @Override
    public Page<Staff> getListStaffsAdmin(int pageNo, int pageSize, String sortField, String sortDirection, String keyword, List<Boolean> status) {
        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortField).ascending() : Sort.by(sortField).descending() ;
        Pageable pageable = PageRequest.of(pageNo -1, pageSize,sort);
        boolean hasKeyword = keyword != null && !keyword.isEmpty();
        if(status != null) {
            if (hasKeyword) {
                return staffRepository.getListStaffsAdminWithKeywordAndStatus(keyword, status, pageable);
            }
            else {
                return staffRepository.getListStaffsAdminAndStatus(status, pageable);
            }
        }
        else {
            if (hasKeyword) {
                return staffRepository.getListStaffsAdminWithKeyword(keyword, pageable);
            }
            else {
                return staffRepository.getListStaffsAdmin(pageable);
            }
        }

    }

    public int countStaffByAccount_Role(Role role) {
        return staffRepository.countStaffByAccount_Role(role);
    }
}
