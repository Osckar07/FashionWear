// Importar express router
const express = require("express");
const routes = express.Router();

// Importar los controladores
const productosController = require("../controllers/productosController");
const usuariosController = require("../controllers/usuariosController");

// Construir las rutas disponibles para el servidor
module.exports = function () {
  
  routes.get("/", productosController.inicioProductos);

  routes.get("/crear_usuario", usuariosController.formularioRegistrarse);

  return routes;
};
