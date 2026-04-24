package com.uade.tpo.e_commerce.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.model.Categoria;
import com.uade.tpo.e_commerce.repository.ProductoRepository;
import com.uade.tpo.e_commerce.repository.CategoriaRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository; 

    // Devuelve todos los productos ordenados por nombre
    public List<Producto> getAllProductos() {
        return productoRepository.findAllByOrderByNombreAsc();
    }

    // Devuelve un producto por su id
    public Producto getProductoById(Long id) {
        return productoRepository.findById(id).orElse(null);
    }

    // Crea un producto VINCULANDO la categoría
    public Producto saveProducto(Producto producto) {
        // Lógica para el alta: vinculamos la categoría si viene el ID
        if (producto.getCategoria() != null && producto.getCategoria().getId() != null) {
            Categoria categoria = categoriaRepository.findById(producto.getCategoria().getId())
                    .orElseThrow(() -> new RuntimeException("La categoría no existe"));
            producto.setCategoria(categoria);
        }
        return productoRepository.save(producto);
    }

    // Elimina un producto por su id
    public void deleteProductoById(Long id) {
        productoRepository.deleteById(id);
    }
}