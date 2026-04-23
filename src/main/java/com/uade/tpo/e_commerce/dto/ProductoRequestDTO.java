package com.uade.tpo.e_commerce.dto;

import lombok.Data;

// DTO que recibe la información del producto desde el cliente
@Data
public class ProductoRequestDTO {
    
    private String nombre;
    private String descripcion;
    private double precio;
    // id del usuario al que pertenece el producto
    private Long usuarioId;
}
