package com.uade.tpo.e_commerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.repository.ProductoRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    // Devuelve todos los productos ordenados por nombre
    public List<Producto> getAllProductos() {
        return productoRepository.findAllByOrderByNombreAsc();
    }

    // Devuelve un producto por su id
    public Producto getProductoById(Long id) {
        return productoRepository.findById(id).orElse(null);
    }

    // Crea o actualiza un producto
    public Producto saveProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    // Elimina un producto por su id
    public void deleteProductoById(Long id) {
        productoRepository.deleteById(id);
    }
}