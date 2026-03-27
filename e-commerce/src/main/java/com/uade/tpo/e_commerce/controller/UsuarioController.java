package com.uade.tpo.e_commerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.e_commerce.service.UsuarioService;
import com.uade.tpo.e_commerce.model.Usuario;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// @RestController indica que esta clase es un controlador de Spring, lo que permite manejar solicitudes HTTP
// @RequestMapping("/api/usuarios") define la ruta base para todas las solicitudes de este controlador
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // http://localhost:8080/api/usuarios -> devuelve todos los usuarios
    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return usuarioService.getAllUsuarios();
    }

    // http://localhost:8080/api/usuarios/1 -> devuelve el usuario con ID 1
    @GetMapping("/{id}")
    public Usuario getUsuarioById(@PathVariable Long id) {
        return usuarioService.getUsuarioById(id);
    }
    
    // http://localhost:8080/api/usuarios/1 -> elimina el usuario con ID 1
    @DeleteMapping("/{id}")
    public void deleteUsuarioById(@PathVariable Long id) {
        usuarioService.deleteUsuarioById(id);
    }
}
