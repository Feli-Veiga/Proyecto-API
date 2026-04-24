package com.uade.tpo.e_commerce.service;

import java.util.ArrayList;

import com.uade.tpo.e_commerce.repository.ItemCarritoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce.exception.DatosInvalidosException;
import com.uade.tpo.e_commerce.model.Carrito;
import com.uade.tpo.e_commerce.model.ItemCarrito;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.repository.CarritoRepository;
import com.uade.tpo.e_commerce.repository.ProductoRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class CarritoService {

    @Autowired
    private ItemCarritoRepository itemCarritoRepository;

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public Carrito crearCarrito() {

        Carrito carrito = new Carrito();
        carrito.setItems(new ArrayList<>());

        return carritoRepository.save(carrito);
    }

    public Carrito agregarProducto(Long carritoId, Long productoId, Integer cantidad) {

        Carrito carrito = carritoRepository.findById(carritoId).orElseThrow();
        Producto producto = productoRepository.findById(productoId).orElseThrow();

        if (producto.getStock() < cantidad) {
            throw new RuntimeException("Sin stock");
        }

        ItemCarrito item = new ItemCarrito();
        item.setProducto(producto);
        item.setCantidad(cantidad);

        carrito.getItems().add(item);

        return carritoRepository.save(carrito);
    }

    public void checkout(Long carritoId) {

        Carrito carrito = carritoRepository.findById(carritoId).orElseThrow(()-> new RuntimeException("Carrito no encontrado"));

        for (ItemCarrito item : carrito.getItems()) {

            Producto producto = item.getProducto();

            if (producto.getStock() < item.getCantidad()) {
                throw new DatosInvalidosException("Producto " + producto.getNombre() + " sin stock suficiente");
            }

            producto.setStock(producto.getStock() - item.getCantidad());

            productoRepository.save(producto);
        }

        carrito.getItems().clear();

        carritoRepository.save(carrito);
    }

    public Carrito eliminarItem(Long carritoId, Long itemId) {

        Carrito carrito = carritoRepository
                .findById(carritoId)
                .orElseThrow(() ->
                        new RuntimeException("Carrito no encontrado"));

        ItemCarrito item = itemCarritoRepository
                .findById(itemId)
                .orElseThrow(() ->
                        new RuntimeException("Item no encontrado"));

        carrito.getItems().remove(item);

        itemCarritoRepository.delete(item);

        return carritoRepository.save(carrito);
    }

    public Carrito vaciarCarrito(Long carritoId) {

        Carrito carrito = carritoRepository
                .findById(carritoId)
                .orElseThrow(() ->
                        new RuntimeException("Carrito no encontrado"));

        itemCarritoRepository.deleteAll(carrito.getItems());

        carrito.getItems().clear();

        return carritoRepository.save(carrito);
    }

    public Double calcularTotal(Long carritoId) {

        Carrito carrito = carritoRepository
                .findById(carritoId)
                .orElseThrow(() ->
                        new RuntimeException("Carrito no encontrado"));

        return carrito.getItems()
                .stream()
                .mapToDouble(item ->
                        item.getProducto().getPrecio()
                                * item.getCantidad()
                )
                .sum();
    }
}