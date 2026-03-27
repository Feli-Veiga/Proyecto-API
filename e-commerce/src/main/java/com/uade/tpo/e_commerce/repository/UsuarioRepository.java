package com.uade.tpo.e_commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.e_commerce.model.Usuario;

// JpaRepository ya tiene implementados los métodos básicos
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
}