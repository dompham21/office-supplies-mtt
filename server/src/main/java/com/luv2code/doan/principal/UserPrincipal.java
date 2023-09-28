package com.luv2code.doan.principal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.luv2code.doan.entity.Account;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Slf4j
public class UserPrincipal implements UserDetails {

    private static final long serialVersionUID = 1L;


    private String email;

    @JsonIgnore
    private String password;

    private Boolean isActive;


    private Collection<? extends GrantedAuthority> authorities;


    public UserPrincipal(String email, String password,
                         Boolean isActive,
                         Collection<? extends GrantedAuthority> authorities) {
        this.email = email;
        this.password = password;
        this.isActive = isActive;
        this.authorities = authorities;
    }


    public static UserPrincipal build(Account account) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + account.getRole().getName().toUpperCase()));

        return new UserPrincipal(
                account.getEmail(),
                account.getPassword(),
                account.getIsActive(),
                authorities);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }


    public String getEmail() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return isActive;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String getUsername() {
        return email;
    }
}
