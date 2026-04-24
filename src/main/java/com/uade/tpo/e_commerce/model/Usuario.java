package com.uade.tpo.e_commerce.model;

import java.time.LocalDate;
import java.util.List;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

// @Data es una anotación de Lombok que genera automáticamente getters, setters, toString, equals y hashCode
// @Entity indica que esta clase es una entidad de JPA, lo que permite mapearla a una tabla en la base de datos
@Data
@Entity
// Definimos el nombre de la tabla en la base de datos
@Table(name = "usuarios")
public class Usuario {
    // Definimos el ID como clave primaria

    @Enumerated(EnumType.STRING)
    private Role role;
    @Id
    // Generamos el ID automáticamente auto-incremental
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Creamos columnas para nombre, email y password
    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(nullable = false)
    private String sexo;

    // Un usuario puede tener muchos productos
    // @OneToMany -> relación uno a muchos
    // mappedBy -> indica que la relación la maneja el campo "usuario" en Producto
    @OneToMany(mappedBy = "usuario")
    private List<Producto> productos;
}
