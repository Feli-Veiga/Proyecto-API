package com.uade.tpo.e_commerce.controller;

import com.uade.tpo.e_commerce.model.Categoria;
import com.uade.tpo.e_commerce.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public List<Categoria> getAll() {
        return categoriaService.getAllCategorias();
    }

    @PostMapping
    public Categoria create(@RequestBody Categoria categoria) {
        return categoriaService.saveCategoria(categoria);
    }
}