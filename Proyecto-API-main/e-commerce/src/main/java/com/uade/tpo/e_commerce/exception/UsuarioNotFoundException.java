package com.uade.tpo.e_commerce.exception;

public class UsuarioNotFoundException extends RuntimeException {
    public UsuarioNotFoundException(Long id) {
        super("Usuario no encontrado con ID: " + id);
    }

    public UsuarioNotFoundException(String message) {
        super(message);
    }
}
