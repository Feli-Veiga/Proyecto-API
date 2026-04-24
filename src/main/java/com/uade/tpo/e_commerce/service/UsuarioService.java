package com.uade.tpo.e_commerce.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce.dto.LoginRequest;
import com.uade.tpo.e_commerce.dto.UsuarioRequestDTO;
import com.uade.tpo.e_commerce.dto.UsuarioResponseDTO;
import com.uade.tpo.e_commerce.exception.DatosInvalidosException;
import com.uade.tpo.e_commerce.exception.UsuarioNotFoundException;
import com.uade.tpo.e_commerce.model.Role;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    // =============================
    // MAPPER
    // =============================

    private UsuarioResponseDTO toResponseDTO(Usuario usuario) {

        UsuarioResponseDTO dto = new UsuarioResponseDTO();

        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setEmail(usuario.getEmail());
        dto.setFechaNacimiento(usuario.getFechaNacimiento());
        dto.setSexo(usuario.getSexo());

        return dto;
    }

    // =============================
    // GET ALL
    // =============================

    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    // =============================
    // GET BY ID
    // =============================

    public Usuario getUsuarioById(Long id) {

        return usuarioRepository
                .findById(id)
                .orElseThrow(() ->
                        new UsuarioNotFoundException(
                                "Usuario no encontrado con ID: " + id));
    }

    // =============================
    // REGISTER
    // =============================

    public UsuarioResponseDTO registerUsuario(
            UsuarioRequestDTO request) {

        validateRequest(request);

        if (usuarioRepository.existsByEmail(
                request.getEmail())) {

            throw new DatosInvalidosException(
                    "El email ya está registrado");
        }

        Usuario usuario = new Usuario();

        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setEmail(request.getEmail());

        usuario.setPassword(
                passwordEncoder.encode(
                        request.getPassword())
        );

        usuario.setFechaNacimiento(
                request.getFechaNacimiento());

        usuario.setSexo(request.getSexo());

        usuario.setRole(Role.USER);

        Usuario guardado =
                usuarioRepository.save(usuario);

        return toResponseDTO(guardado);
    }

    // =============================
    // VALIDATION
    // =============================

    private void validateRequest(
            UsuarioRequestDTO request) {

        if (request == null) {
            throw new DatosInvalidosException(
                    "La información del usuario es obligatoria");
        }

        if (request.getNombre() == null
                || request.getNombre().isBlank()) {
            throw new DatosInvalidosException(
                    "El nombre es obligatorio");
        }

        if (request.getApellido() == null
                || request.getApellido().isBlank()) {
            throw new DatosInvalidosException(
                    "El apellido es obligatorio");
        }

        if (request.getEmail() == null
                || request.getEmail().isBlank()) {
            throw new DatosInvalidosException(
                    "El email es obligatorio");
        }

        if (request.getPassword() == null
                || request.getPassword().isBlank()) {
            throw new DatosInvalidosException(
                    "La contraseña es obligatoria");
        }

        if (request.getFechaNacimiento() == null) {
            throw new DatosInvalidosException(
                    "La fecha de nacimiento es obligatoria");
        }

        LocalDate fechaNacimiento = request.getFechaNacimiento();
        LocalDate fechaActual = LocalDate.now();
        int edadCalculada = fechaActual.getYear() - fechaNacimiento.getYear();

        if (edadCalculada < 18) {
            throw new DatosInvalidosException(
                    "Debes ser mayor de 18 años para registrarte");
        }

        if (request.getSexo() == null
                || request.getSexo().isBlank()) {
            throw new DatosInvalidosException(
                    "El sexo es obligatorio");
        }
    }

    // =============================
    // DELETE
    // =============================

    public void deleteUsuarioById(Long id) {

        if (!usuarioRepository.existsById(id)) {

            throw new UsuarioNotFoundException(
                    "Usuario no encontrado con ID: " + id);
        }

        usuarioRepository.deleteById(id);
    }

    // =============================
    // LOGIN
    // =============================

    public String login(LoginRequest request) {

        if (request == null) {
            throw new DatosInvalidosException(
                    "Datos de login obligatorios");
        }

        if (request.getEmail() == null
                || request.getEmail().isBlank()) {
            throw new DatosInvalidosException(
                    "El email es obligatorio");
        }

        if (request.getPassword() == null
                || request.getPassword().isBlank()) {
            throw new DatosInvalidosException(
                    "La contraseña es obligatoria");
        }

        Usuario usuario = usuarioRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new DatosInvalidosException(
                                "Usuario no encontrado"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                usuario.getPassword())) {

            throw new DatosInvalidosException(
                    "Password incorrecto");
        }

        return jwtService.generateToken(
                usuario.getEmail());
    }

}