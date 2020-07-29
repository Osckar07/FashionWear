// Este controlador se encargará solo de tareas de autenticación
// Importar passport
const passport = require("passport");
// Importar el modelo de Usuario
const Usuario = require("../models/Usuario");
// Importar el sequelize
const Sequelize = require("sequelize");
// Utilizar los operadores de Sequelize
const Op = Sequelize.Op;
// Importar crypto
const crypto = require("crypto");
// Importar la configuración de envío de correo electrónico
const enviarCorreo = require("../helpers/email");
// Importar bcrypt
const bcrypt = require("bcrypt-nodejs");

// Verificar si el usuario se puede autenticar con sus credenciales
exports.autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/iniciar_sesion",
  badRequestMessage: "Debes ingresar tu correo electrónico y tu contraseña",
  failtureFlash: true,
});

exports.loginFacebook = passport.authenticate('facebook');

exports.loginFacebook = passport.authenticate('facebook', {
      successRedirect : '/',
      failureRedirect : '/iniciar_sesion',
      badRequestMessage: "Debes ingresar tu correo electrónico y tu contraseña",
      failtureFlash: true
});

exports.cerrarSesion = (req, res, next) => {
  // Al cerrar sesión redirigimos al usuario al inicio de sesión
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.usuarioAutenticado = (req, res, next) => {
  // Si el usuario está autenticado que contiene con la petición
  if (req.isAuthenticated()){
    return next();
  }

  // Si el usuario no está autenticado, iniciar sesión
  return res.redirect("/iniciar_sesion");
};

// Genera un token para restablecer la contraseña
exports.enviarToken = async (req, res, next) => {
  // Verificar si existe el usuario
  const { email } = req.body;
  const usuario = await Usuario.findOne({
    where: {
      email,
    },
  });

  // Si el usuario no existe
  if (!usuario) {
    req.flash("error", "¡Este usuario no está registrado en FashionWear!");
    res.redirect("/restablecer_contrasena");
  }

  // Si el usuario existe
  // Generar un token único con una fecha de expiración
  usuario.token = crypto.randomBytes(20).toString("hex");
  usuario.expiration = Date.now() + 3600000;

  // Guardar el token y la fecha de validez
  await usuario.save();

  // URL de reestablecer contraseña
  const resetUrl = `http://${req.headers.host}/resetear_contrasena/${usuario.token}`;

  // Enviar el correo electrónico al usuario con el link que contiene
  // el token generado
  await enviarCorreo.enviarCorreo({
    usuario,
    subject: "Restablece tu contraseña de Taskily",
    resetUrl,
    vista: "email_restablecer",
    text:
      "Has solicitado restablecer tu contraseña de Taskily! Autoriza el contenido HTML.",
  });

  // Redireccionar al usuario al inicio de sesión
  req.flash(
    "success",
    "Se envió un enlace para reestablecer tu contraseña a tu correo electrónico"
  );
  res.redirect("/iniciar_sesion");
};