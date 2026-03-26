package com.uade.tpo.e_commerce.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
// Definimos el nombre de la tabla en la base de datos
@Table(name = "usuarios")
public class Usuario {
    // Definimos el ID como clave primaria
    @Id
    // Generamos el ID automáticamente auto-incremental
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Creamos columnas para nombre, email y password
    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String email;

    private String password;
}
