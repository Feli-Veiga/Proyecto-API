package com.uade.tpo.e_commerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.e_commerce.model.Carrito;
import com.uade.tpo.e_commerce.service.CarritoService;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    @DeleteMapping("/{carritoId}/item/{itemId}")
    public Carrito eliminarItem(
            @PathVariable Long carritoId,
            @PathVariable Long itemId) {

        return carritoService.eliminarItem(
                carritoId,
                itemId
        );
    }

    @PostMapping("/{carritoId}/vaciar")
    public Carrito vaciarCarrito(
            @PathVariable Long carritoId) {

        return carritoService.vaciarCarrito(
                carritoId
        );
    }

    @GetMapping("/{carritoId}/total")
    public Double calcularTotal(
            @PathVariable Long carritoId) {

        return carritoService.calcularTotal(
                carritoId
        );
    }

    @PostMapping("/{carritoId}/checkout")
    public ResponseEntity<String> checkout(@PathVariable Long carritoId) {
        carritoService.checkout(carritoId);
        return ResponseEntity.ok("Compra realizada con éxito y stock actualizado");
    }
}