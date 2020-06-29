// Importar express router
const express = require("express");
const routes = express.Router();

// Importar los controladores
const productosController = require("../controllers/productosController");

// Construir las rutas disponibles para el servidor
module.exports = function () {
  
  routes.get("/", productosController.inicioProductos);

  return routes;
};
