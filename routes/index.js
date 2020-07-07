// Importar express router
const express = require("express");
const routes = express.Router();

// Importar los controladores
const productosController = require("../controllers/productosController");
const usuariosController = require("../controllers/usuariosController");
const authController = require("../controllers/authController");

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

  //Rutas para inicio de sesion con facebook
  routes.get('/registro/facebook',authController.loginFacebook);
  routes.get('/auth/facebook/callback', authController.loginFacebook);
  routes.get('/auth/facebook/callback',usuariosController.iniciarFacebook);

  // Ruta post para autenticar usuario
  routes.post("/iniciar_sesion", authController.autenticarUsuario);

  // Ruta para cerrar la sesión 
  routes.get("/cerrar_sesion", authController.cerrarSesion);

  // Rutas para producto
  routes.get("/nuevo_producto", authController.usuarioAutenticado, productosController.formularioNuevoProducto);

  routes.post("/nuevo_producto", authController.usuarioAutenticado, productosController.nuevoProducto);

  routes.get("/productos", productosController.mostrarProductos);  

  routes.get("/perfil/usuario",authController.usuarioAutenticado, usuariosController.perfil); 
  routes.get("/perfil/usuario/cambiar_contrasena",authController.usuarioAutenticado, usuariosController.cambiar_contrasena);  

  return routes;
};
