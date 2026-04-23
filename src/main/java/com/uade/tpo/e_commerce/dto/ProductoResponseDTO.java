package com.uade.tpo.e_commerce.dto;

import lombok.Data;

// DTO que devuelve la información del producto al cliente
@Data
public class ProductoResponseDTO {
    
    private Long id;
    private String nombre;
    private String descripcion;
    private double precio;
    // En vez de devolver el usuario completo, solo devolvemos su ID para evitar problemas de serialización
    private Long usuarioId;
}
