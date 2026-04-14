package com.uade.tpo.e_commerce.repository;

import com.uade.tpo.e_commerce.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    // Requisito: Listado de categorías
}