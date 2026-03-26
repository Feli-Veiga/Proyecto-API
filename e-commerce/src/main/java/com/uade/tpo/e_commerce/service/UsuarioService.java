package com.uade.tpo.e_commerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    // Devuelve todos los usuarios de la BD
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    // Devuelve un usuario por ID o null si no existe
    public Usuario getUsuarioById(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    // Elimina un usuario por ID
    public void deleteUsuarioById(Long id) {
        usuarioRepository.deleteById(id);
    }
}
