package com.luv2code.doan.service;

import com.luv2code.doan.entity.Role;
import com.luv2code.doan.exceptions.NotFoundException;

public interface RoleService {
    public Role getRoleByName(String name) throws NotFoundException;

    public Role saveRole(Role role);

    public Role getRoleByID(int id);
}
