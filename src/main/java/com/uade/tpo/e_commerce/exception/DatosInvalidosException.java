package com.uade.tpo.e_commerce.exception;

public class DatosInvalidosException extends IllegalArgumentException {
    public DatosInvalidosException(String message) {
        super(message);
    }
}