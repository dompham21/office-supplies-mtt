package com.luv2code.doan.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.luv2code.doan.bean.Token;
import com.luv2code.doan.entity.Account;

import javax.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.stream.Collectors;

public class TokenUtils {

    final static long TIME_EXP_ACCESS_TOKEN = 365L * 24 * 60 * 60 * 1000; // 365 days
    final static long TIME_EXP_REFRESH_TOKEN = 365L * 24 * 60 * 60 * 1000; // 365 days

    public Token generateToken(Account account, HttpServletRequest request) {
        Algorithm algorithm = Algorithm.HMAC256("secret".getBytes(StandardCharsets.UTF_8));
        String accessToken = JWT.create()
                .withSubject(account.getEmail())
                .withExpiresAt(new Date(System.currentTimeMillis() + TIME_EXP_ACCESS_TOKEN))
                .withIssuer(request.getRequestURI().toString())
                .withClaim("role", "ROLE_".concat(account.getRole().getName()).toUpperCase())
                .sign(algorithm);

        String refreshToken = JWT.create()
                .withSubject(account.getEmail())
                .withExpiresAt(new Date(System.currentTimeMillis() + TIME_EXP_REFRESH_TOKEN))
                .withIssuer(request.getRequestURI().toString())
                .withClaim("role", "ROLE_".concat(account.getRole().getName()).toUpperCase())
                .sign(algorithm);

        return new Token(accessToken, refreshToken);
    }

    public Token refreshAccessToken(Account account , String refreshToken,  HttpServletRequest request) {
        Algorithm algorithm = Algorithm.HMAC256("secret".getBytes(StandardCharsets.UTF_8));
        String accessToken = JWT.create()
                .withSubject(account.getEmail())
                .withExpiresAt(new Date(System.currentTimeMillis() + TIME_EXP_ACCESS_TOKEN)) //1 hour
                .withIssuer(request.getRequestURI().toString())
                .withClaim("role", "ROLE_".concat(account.getRole().getName()).toUpperCase())
                .sign(algorithm);
        return new Token(accessToken, refreshToken);
    }

    public DecodedJWT decodedToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256("secret".getBytes(StandardCharsets.UTF_8));
        JWTVerifier verifier = JWT.require(algorithm).build();
        return verifier.verify(token);
    }



}
