package com.uade.tpo.e_commerce.service;

import com.uade.tpo.e_commerce.dto.CompraRequestDTO;
import com.uade.tpo.e_commerce.dto.ItemCompraRequestDTO;
import com.uade.tpo.e_commerce.model.*;
import com.uade.tpo.e_commerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class CheckoutService {

    @Autowired
    private CompraRepository compraRepository;

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Compra procesarCompra(CompraRequestDTO dto, String numeroTarjeta, String cvv, String fechaVencimiento) {

        // Validación número de tarjeta
        if (numeroTarjeta == null || numeroTarjeta.length() != 16) {
            throw new RuntimeException("Número de tarjeta inválido. Debe tener 16 dígitos.");
        }

        // Validación CVV
        if (cvv == null || cvv.length() != 3) {
            throw new RuntimeException("CVV inválido. Debe tener 3 dígitos.");
        }

        // Validación fecha de vencimiento (formato MM/AA)
        if (fechaVencimiento == null || !fechaVencimiento.matches("\\d{2}/\\d{2}")) {
            throw new RuntimeException("Fecha de vencimiento inválida. Formato requerido: MM/AA.");
        }
        String[] partes = fechaVencimiento.split("/");
        int mes = Integer.parseInt(partes[0]);
        int anio = Integer.parseInt(partes[1]) + 2000;
        LocalDateTime ahora = LocalDateTime.now();
        if (anio < ahora.getYear() || (anio == ahora.getYear() && mes < ahora.getMonthValue())) {
            throw new RuntimeException("La tarjeta está vencida.");
        }

        // Crear la compra
        Compra compra = new Compra();
        compra.setFechaCreacion(LocalDateTime.now());
        compra.setEstadoCompra(EstadoCompra.PENDIENTE);
        compra.setEmailInvitado(dto.getEmail());

        // Vincular usuario si existe
        if (dto.getUsuarioId() != null) {
            Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            compra.setUsuario(usuario);
        }

        // Procesar items y validar stock
        List<ItemCompra> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (ItemCompraRequestDTO itemDTO : dto.getItems()) {
            Producto producto = productoRepository.findById(itemDTO.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + itemDTO.getProductoId()));

            if (producto.getStock() < itemDTO.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + producto.getNombre());
            }

            // Restar stock
            producto.setStock(producto.getStock() - itemDTO.getCantidad());
            productoRepository.save(producto);

            // Crear item
            ItemCompra item = new ItemCompra();
            item.setProducto(producto);
            item.setCantidad(itemDTO.getCantidad());
            item.setPrecioUnitario(BigDecimal.valueOf(producto.getPrecio()));
            item.setCompra(compra);
            items.add(item);

            total = total.add(BigDecimal.valueOf(producto.getPrecio())
                    .multiply(BigDecimal.valueOf(itemDTO.getCantidad())));
        }

        compra.setItems(items);
        compra.setTotal(total);
        compra.setEstadoCompra(EstadoCompra.PAGADO);
        compraRepository.save(compra);

        // Registrar pago simulado
        Pago pago = new Pago();
        pago.setCompra(compra);
        pago.setTransaccionIdMp("SIM-" + System.currentTimeMillis());
        pago.setEstadoPago("APPROVED");
        pago.setMetodoPago("TARJETA");
        pagoRepository.save(pago);

        return compra;
    }
}