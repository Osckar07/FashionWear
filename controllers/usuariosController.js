// Importar los modelos necesarios
const Producto = require("../models/Producto");
const Categoria = require("../models/Categoria");
const Usuario = require("../models/Usuario");
const { userEnter } = require("./usuariosController");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const path = require("path");
const cloudinary = require("cloudinary");
const fs = require("fs-extra");
const { fips } = require("crypto");

// Configuración para cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.formularioRegistrarse = (req, res, next) => {
  res.render("registrarse", { layout: "auth" });
};

exports.registrarse = async (req, res, next) => {
  // Obtener los datos de la nueva cuenta mediante destructuring
  const { nombre, apellido, email, password } = req.body;

  const tipoUsuario = verificarTipoUsuario(password);

  console.log("tipo de usuario", tipoUsuario);

  // Intentar crear el usuario
  try {
    await Usuario.create({
      tipoUsuario,
      nombre,
      apellido,
      email,
      password,
    });
    // Redireccionar el usuario al formulario de inicio de sesión
    res.redirect("iniciar_sesion");
  } catch (error) {
    //console.log(tipoUsuario, nombre, apellido, email, password);
    // res.render("registrarse");
    res.render(
      "registrarse",
      { layout: "auth" },
      {
        error,
      }
    );
  }
};

exports.formularioInicioSesion = (req, res, next) => {
  //Verificar si existe algun mensaje
  const { mensajes } = res.locals.mensajes;
  // console.log(mensajes);
  res.render("iniciar_sesion", { layout: "auth", mensajes });
};

// Función que nos servirá a verificar si al registrarse un usuario admin posee la contraseña maestra para los admin
function verificarTipoUsuario(pass) {
  if (pass == "invictus") {
    return 0;
  } else {
    return 1;
  }
}

exports.iniciarFacebook = (req, res, next) => {
  res.locals.usuario = { ...req.user } || null;
  console.log("Usiaro es:", res.locals.usuario);
};

exports.perfil = (req, res, next) => {
  res.render("usuario");
};

exports.cambiar_contrasena = (req, res, next) => {
  res.render("cambiar_contrasena", { layout: "main" });
};

exports.userEnter = (req, res, next) => {
  res.render("empresaDatos", { layout: "userEnter" });
};

exports.dashboard = (req, res, next) => {
  res.render("dashboard", { layout: "userEnter" });
};

exports.formResetearContrasena = (req, res, next) => {
  res.render("restablecer_contrasena", { layout: "auth" });
};

exports.perfilUsuarioNormal = (req, res, next) => {
  res.render("perfil_usuario");
};

exports.actualizarInfoUsuario = async (req, res, next) => {
  const usuario = res.locals.usuario;

  const { email, telefono, direccion } = req.body;
  const mensajes = [];

  if (!telefono || !direccion) {
    mensajes.push({
      error: "Debes completar todos los campos",
      type: "alert-danger",
    });
  }
  // Si hay errores
  if (mensajes.length) {
    res.render("perfil_usuario", {
      mensajes,
    });
  } else {
    try {
        console.log(req.file);
      const result = await cloudinary.v2.uploader.upload(
        req.file.path,
        (error, resulado) => {
          console.log(resulado, error);
        }
      );
      console.log(result);

      // Insertar el producto a la base de datos
      await Usuario.update(
        {
            imagen: result.url,
        },
        {
          where: {
            id: usuario.id,
          },
        }
      );

      console.log(req.file.path);
      
      await fs.unlink(req.file.path);

      mensajes.push({
        error: "Producto almacenado satisfactoriamente.",
        type: "alert-success",
      });

      res.redirect("/perfil/usuario");
    } catch (error) {
      mensajes.push({
        error:
          "Ha ocurrido un error interno en el servidor. Comunicate con el personal de Invictus Development.",
        type: "alert-warning",
      });
    }
  }

  //   res.render("perfil_usuario");
};
