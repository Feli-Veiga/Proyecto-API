package com.uade.tpo.e_commerce.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
// Definimos el nombre de la tabla en la base de datos
@Table(name = "productos")
public class Producto {
    // Definimos el ID como clave primaria
    @Id
    // Generamos el ID automáticamente auto-incremental
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Creamos columnas para nombre, descripción y precio
    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    private Double precio;

    // Muchos productos pueden pertenecer a un usuario
    // @ManyToOne -> relación muchos a uno
    // @JoinColumn -> columna que guarda el id del usuario en la tabla productos
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;



    @Column(nullable = false)
    private Integer stock;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;
}