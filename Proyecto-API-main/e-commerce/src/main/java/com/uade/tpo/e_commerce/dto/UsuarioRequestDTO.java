package com.uade.tpo.e_commerce.dto;

import java.time.LocalDate;

import lombok.Data;
@Data
public class UsuarioRequestDTO {
    
    private String nombre;
    private String email;
    private String password;
    private LocalDate fechaNacimiento;
    private String sexo;
}
