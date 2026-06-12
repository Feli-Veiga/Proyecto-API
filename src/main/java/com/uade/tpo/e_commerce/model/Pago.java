package com.uade.tpo.e_commerce.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "pagos")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "compra_id")
    private Compra compra;

    @Column(name = "transaccion_id_mp")
    private String transaccionIdMp;

    @Column(name = "estado_pago")
    private String estadoPago;

    @Column(name = "metodo_pago")
    private String metodoPago;
}