// Importar express router
const express = require("express");
const routes = express.Router();

// Importar los controladores
const productosController = require("../controllers/productosController");
const usuariosController = require("../controllers/usuariosController");

// Construir las rutas disponibles para el servidor
module.exports = function () {
  
  // Ruta principal
  routes.get("/", productosController.inicioProductos);

  // Ruta para el formulario de registro
  routes.get("/registro", usuariosController.formularioRegistrarse);

  // Ruta post para insertar el registro en la BD
  routes.post("/registro", usuariosController.registrarse);

  // Ruta para el formulario de iniciar_sesion
  routes.get("/iniciar_sesion", usuariosController.formularioInicioSesion);

  return routes;
};
