package com.uade.tpo.e_commerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce.dto.UsuarioRequestDTO;
import com.uade.tpo.e_commerce.dto.UsuarioResponseDTO;
import com.uade.tpo.e_commerce.exception.DatosInvalidosException;
import com.uade.tpo.e_commerce.exception.UsuarioNotFoundException;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

// @Service indica que esta clase es un servicio de Spring, lo que permite que sea inyectada en otras partes del código
// @Transactional asegura consitencia, atomicidad e integridad en las operaciones de la base de datos, si algo falla se revierte todo
@Service
@Transactional
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    private UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setEmail(usuario.getEmail());
        dto.setFechaNacimiento(usuario.getFechaNacimiento());
        dto.setSexo(usuario.getSexo());
        return dto;
    }

    // Devuelve todos los usuarios de la BD
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    // Devuelve un usuario por ID o null si no existe
    public Usuario getUsuarioById(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public UsuarioResponseDTO registerUsuario(UsuarioRequestDTO request) {
        validateRequest(request);

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(request.getPassword());
        usuario.setFechaNacimiento(request.getFechaNacimiento());
        usuario.setSexo(request.getSexo());

        Usuario guardado = usuarioRepository.save(usuario);
        return (UsuarioResponseDTO) toResponseDTO(guardado);
    }

    private void validateRequest(UsuarioRequestDTO request) {
    if (request == null) {
        throw new DatosInvalidosException("La información del usuario es obligatoria");
    }
    if (request.getNombre() == null || request.getNombre().isBlank()) {
        throw new DatosInvalidosException("El nombre es obligatorio");
    }
    if (request.getEmail() == null || request.getEmail().isBlank()) {
        throw new DatosInvalidosException("El email es obligatorio");
    }
    if (request.getPassword() == null || request.getPassword().isBlank()) {
        throw new DatosInvalidosException("La contraseña es obligatoria");
    }
    if (request.getFechaNacimiento() == null) {
        throw new DatosInvalidosException("La fecha de nacimiento es obligatoria");
    }
    if (request.getSexo() == null || request.getSexo().isBlank()) {
        throw new DatosInvalidosException("El sexo es obligatorio");
    }
}

    // Elimina un usuario por ID
    public void deleteUsuarioById(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new UsuarioNotFoundException("Usuario no encontrado con ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }
}
