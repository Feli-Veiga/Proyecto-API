package com.uade.tpo.e_commerce.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private Long userId;
}