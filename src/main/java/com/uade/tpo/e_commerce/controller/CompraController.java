package com.uade.tpo.e_commerce.controller;

import com.uade.tpo.e_commerce.dto.CompraRequestDTO;
import com.uade.tpo.e_commerce.model.Compra;
import com.uade.tpo.e_commerce.service.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/compras")
public class CompraController {

    @Autowired
    private CheckoutService checkoutService;

    @PostMapping
    public ResponseEntity<?> crearCompra(
            @RequestBody CompraRequestDTO dto,
            @RequestParam String numeroTarjeta,
            @RequestParam String cvv,
            @RequestParam String fechaVencimiento) {
        try {
            Compra compra = checkoutService.procesarCompra(dto, numeroTarjeta, cvv, fechaVencimiento);
            return ResponseEntity.status(HttpStatus.CREATED).body(compra);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}