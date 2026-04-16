package com.uade.tpo.e_commerce.dto;

import java.time.LocalDate;

import lombok.Data;
//DTO utilizado para recibir los datos de creación de un usuario desde el cliente.
//Esta clase se usa como entrada en los endpoints y luego es procesada en la capa de servicio.

@Data // Lombok genera getters, setters y constructores
public class UsuarioRequestDTO {
    
    private String nombre;
    private String email;
    private String password;
    private LocalDate fechaNacimiento;
    private String sexo;
}
