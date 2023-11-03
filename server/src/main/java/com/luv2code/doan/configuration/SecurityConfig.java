package com.luv2code.doan.configuration;


import com.luv2code.doan.filter.CustomAccessDeniedHandler;
import com.luv2code.doan.filter.CustomAuthorizationFilter;
import com.luv2code.doan.service.impl.AccountServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig  extends WebSecurityConfigurerAdapter {

    private final AccountServiceImpl userDetailsService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;


    //kiểm tra header request của người dùng trước khi nó tới đích
    @Bean
    public CustomAuthorizationFilter authorizationFilter() {
        return new CustomAuthorizationFilter();
    }

    // Handle require role
    @Bean
    public AccessDeniedHandler accessDeniedHandler(){
        return new CustomAccessDeniedHandler();
    }

    @Override
    public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder);
    }


    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
                .exceptionHandling()
                .accessDeniedHandler(accessDeniedHandler()).and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers("/api/auth/**",
                        "/api/category/**",
                        "/api/brand/**",
                        "/api/product/**",
                        "/api/poster/**",
                        "/api/supplier/**",
                        "/api/image/**",
                        "/api/test/**",
                        "/api/review/get/**",
                        "/api/address/province/**", "/api/address/district/**", "/api/address/ward/**",
                        "/api/otp/forgot/generateOTP",
                        "/api/otp/forgot/validateOTP",
                        "/api/otp/sms",
                        "/v2/api-docs",
                        "/configuration/**",
                        "/swagger*/**",
                        "/webjars/**").permitAll()
                .antMatchers("/api/review/add",
                        "/api/review/update/**",
                        "/api/review/user",
                        "/api/review/detail/**",
                        "/api/cart/**",
                        "/api/address/get",
                        "/api/address/default",
                        "/api/address/add",
                        "/api/address/update/**",
                        "/api/address/delete/**",
                        "/api/order/**",
                        "/api/paypal/**",
                        "/api/otp/generateOTP",
                        "/api/otp/validateOTP",
                        "/api/profile/**").hasAnyAuthority("ROLE_USER")
                .antMatchers("/api/shipper/**").hasAnyAuthority("ROLE_SHIPPER")
                .antMatchers("/api/admin/profile/**", "/api/admin/invoice/get/**").hasAnyAuthority("ROLE_SHIPPER", "ROLE_ADMIN")
                .antMatchers("/api/admin/**").hasAnyAuthority("ROLE_ADMIN")
                .anyRequest().authenticated();
        http.addFilterBefore(authorizationFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/v2/api-docs", "/configuration/**", "/swagger-resources/**",  "/swagger-ui.html", "/webjars/**", "/api-docs/**");
    }


}
