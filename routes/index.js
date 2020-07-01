// Importar express router
const express = require("express");
const routes = express.Router();

// Importar los controladores
const productosController = require("../controllers/productosController");
const usuariosController = require("../controllers/usuariosController");

// Construir las rutas disponibles para el servidor
module.exports = function () {
  
  routes.get("/", productosController.inicioProductos);

  //Rutas para crear usuario
  routes.get("/crear_usuario", usuariosController.formularioRegistrarse);

  //Rutas para inicio de sesion
  routes.get("/iniciar_sesion", usuariosController.formularioInicioSesion);
  return routes;
};
