package com.uade.tpo.e_commerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.e_commerce.dto.LoginRequest;
import com.uade.tpo.e_commerce.service.UsuarioService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return usuarioService.login(request);
    }
}