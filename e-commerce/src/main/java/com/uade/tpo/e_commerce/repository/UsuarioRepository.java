package com.uade.tpo.e_commerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.e_commerce.model.Usuario;

@Repository
public interface UsuarioRepository
        extends JpaRepository<Usuario, Long> {

    // Buscar usuario por email
    Optional<Usuario> findByEmail(String email);

    // Verificar si email ya existe
    boolean existsByEmail(String email);

}