// Importar express router
const express = require("express");
const routes = express.Router();
// Importar express-validator
const { body } = require("express-validator");

// Importar los controladoresa
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
  routes.get("/registro/facebook", authController.loginFacebook);
  routes.get("/auth/facebook/callback", authController.loginFacebook);
  routes.get("/auth/facebook/callback", usuariosController.iniciarFacebook);

  // Ruta post para autenticar usuario
  routes.post("/iniciar_sesion", authController.autenticarUsuario);

  // Ruta para cerrar la sesión
  routes.get("/cerrar_sesion", authController.cerrarSesion);

  // Rutas para resetar pass
  routes.get(
    "/form_resetear_contrasena",    
    usuariosController.formResetearContrasena
  );

  routes.post("/restablecer_password", authController.enviarToken);

  routes.get("/resetear_password/:token", authController.validarToken);

  routes.post(
    "/resetear_password/:token",
    authController.actualizarPassword
  );

  // Rutas para producto
  routes.get(
    "/nuevo_producto",
    authController.usuarioAutenticado,    
    authController.usuarioAdmin,
    productosController.formularioNuevoProducto
  );

  routes.post(
    "/nuevo_producto",
    authController.usuarioAutenticado,
    // Sanitización
    body("nombre").notEmpty().trim().escape(),
    body("descripcion").notEmpty().trim().escape(),
    authController.usuarioAdmin,
    productosController.nuevoProducto
  );

  routes.get("/productos", productosController.mostrarProductos); 

  routes.get("/producto/:url", productosController.obtenerProductoPorUrl);

  routes.get(
    "/producto/actualizar_producto/:url",
    authController.usuarioAutenticado,
    authController.usuarioAdmin,
    productosController.modificarProducto
  );

  routes.delete(
    "/producto/eliminar_producto/:url",
    authController.usuarioAutenticado,
    authController.usuarioAdmin,
    productosController.eliminarProducto
  );

  routes.post(
    "/producto/actualizar_producto/:id",
    authController.usuarioAutenticado,
    body("nombre").notEmpty().trim().escape(),   
    body("descripcion").notEmpty().trim().escape(),
    authController.usuarioAdmin,  
    productosController.actualizarProducto
  );
  
  routes.post(
    "/buscar_producto",
    // Sanitización
    body("parametroBusqueda").notEmpty().trim().escape(),
    productosController.buscarProducto
  );

   //ruta para productosEmpresa
   routes.get(
    "/productos_admin",
    authController.usuarioAutenticado,
    authController.usuarioAdmin,
    productosController.mostrarProductosAdmin
  );

  //ruta para EmpresaDatos
  routes.get(
    "/perfil/mi_tienda",
    authController.usuarioAutenticado,
    authController.usuarioAdmin,
    usuariosController.userEnter
  );    

  //ruta para dashboard
  routes.get(
    "/perfil/mi_tienda/dashboard",
    authController.usuarioAutenticado,
    authController.usuarioAdmin,
    usuariosController.dashboard
  );

  routes.get(
    "/perfil/usuario",
    authController.usuarioAutenticado,
    usuariosController.perfil
  );
  routes.get(
    "/perfil/usuario/cambiar_contrasena",
    authController.usuarioAutenticado,
    usuariosController.cambiar_contrasena
  );

  routes.post(
    "/perfil/usuario/cambiar_contrasena",
    authController.usuarioAutenticado,
    authController.cambiarContrasenaUsuario
  );

  // ruta para perfil de usuario normal  
  routes.get(
    "/perfil/usuario/actualizar_informacion",
    authController.usuarioAutenticado,
    usuariosController.perfilUsuarioNormal
  );

  routes.post(
    "/perfil/usuario/actualizar_informacion",
    authController.usuarioAutenticado,
    usuariosController.actualizarInfoUsuario
  );   

  /*ruta enterUsario */
  routes.get(
    "/inicio/tienda",
    authController.usuarioAutenticado,
    usuariosController.enterUsuario
  );

  /*ruta ver el perfil del vendedor */
  routes.get(
    "/inicio/tienda/:url",    
    usuariosController.enterUsuario
  )
  

  return routes;
};
