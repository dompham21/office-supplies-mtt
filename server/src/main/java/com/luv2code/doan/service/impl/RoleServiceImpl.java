package com.luv2code.doan.service.impl;

import com.luv2code.doan.entity.Role;
import com.luv2code.doan.exceptions.NotFoundException;
import com.luv2code.doan.repository.RoleRepository;
import com.luv2code.doan.service.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
@Transactional
@Slf4j
public class RoleServiceImpl implements RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }

    public Role getRoleByID(int id) {
        Role role = roleRepository.getRoleByID(id);
        return role;
    }

    public Role getRoleByName(String name) throws NotFoundException {
        Role role = roleRepository.getRoleByName(name);
        if(role == null) {
            throw new NotFoundException("Could not find any role with name " + name);
        }
        return role;
    }
}
