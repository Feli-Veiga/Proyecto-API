package com.uade.tpo.e_commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.e_commerce.model.Carrito;

public interface CarritoRepository extends JpaRepository<Carrito, Long> {
}