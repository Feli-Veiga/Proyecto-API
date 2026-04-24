package com.uade.tpo.e_commerce.controller;

import com.uade.tpo.e_commerce.dto.LoginRequest;
import com.uade.tpo.e_commerce.dto.LoginResponse;
import com.uade.tpo.e_commerce.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return usuarioService.login(request);
    }
}