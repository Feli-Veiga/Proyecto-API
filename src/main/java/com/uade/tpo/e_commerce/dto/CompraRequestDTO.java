package com.uade.tpo.e_commerce.dto;

import lombok.Data;
import java.util.List;

@Data
public class CompraRequestDTO {
    private Long usuarioId;
    private String email;
    private DatosEnvioDTO datosEnvio;
    private List<ItemCompraRequestDTO> items;

    @Data
    public static class DatosEnvioDTO {
        private String calle;
        private String codigoPostal;
    }
}