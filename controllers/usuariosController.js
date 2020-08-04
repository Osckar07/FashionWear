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

  const imagen =
    "https://res.cloudinary.com/rivera84/image/upload/v1596177774/usuario_default_aymrvo.png";

  // Intentar crear el usuario
  try {
    await Usuario.create({
      tipoUsuario,
      imagen,
      nombre,
      apellido,
      email,
      password,
    });
    // Redireccionar el usuario al formulario de inicio de sesión
    res.redirect("iniciar_sesion");
  } catch (error) {
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
  console.log("Usuario es:", res.locals.usuario);
};

exports.perfil = async (req, res, next) => {
  const usuario = res.locals.usuario;
  const us = await Usuario.findOne({
    where: {
      id: usuario.id,
    },
  });
  res.render("usuario", {
    us: us.dataValues,
    admin: us.tipoUsuario == 0 ? true : false,
    infoIncompleta: us.telefono == null || us.direccion == null ? true : false,
  });
};

exports.cambiar_contrasena = (req, res, next) => {
  res.render("cambiar_contrasena", { layout: "main" });
};

exports.userEnter = async (req, res, next) => {
  const usuario = res.locals.usuario;
  const us = await Usuario.findOne({
    where: {
      id: usuario.id,
    },
  });
  res.render("usuario", {
    layout: "userEnter",
    us: us.dataValues,
    admin: us.tipoUsuario == 0 ? true : false,
    infoIncompleta: us.telefono == null || us.direccion == null ? true : false,
  });
};

exports.dashboard = (req, res, next) => {
  res.render("dashboard", { layout: "userEnter" });
};

exports.formResetearContrasena = (req, res, next) => {
  res.render("restablecer_contrasena", { layout: "auth" });
};

exports.perfilUsuarioNormal = async (req, res, next) => {
  const usuario = res.locals.usuario;
  const us = await Usuario.findOne({
    where: {
      id: usuario.id,
    },
  });
  res.render("perfil_usuario", { us: us.dataValues });
};

exports.actualizarInfoUsuario = async (req, res, next) => {
  const usuario = res.locals.usuario;

  const { email, telefono, direccion } = req.body;
  const mensajes = [];
  const urls = [];
  const imagenes = req.files;

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
      for (const img of imagenes) {
        const { path } = img;
        const newPath = await cloudinary.v2.uploader.upload(
          path,
          (error, resulado) => {
            console.log(resulado, error);
          }
        );
        urls.push(newPath);
        fs.unlinkSync(path);
      }
      const urlimg1 = urls[0].url;

      if (!urlimg1) {
        await Usuario.update(
          {
            telefono,
            direccion,
          },
          {
            where: {
              id: usuario.id,
            },
          }
        );
      } else {
        // Insertar el producto a la base de datos
        await Usuario.update(
          {
            imagen: urlimg1,
            telefono,
            direccion,
          },
          {
            where: {
              id: usuario.id,
            },
          }
        );
      }

      mensajes.push({
        error: "Información actualizada satisfactoriamente.",
        type: "alert-success",
      });

      // const us = await Usuario.findOne({
      //   where:{
      //     id: usuario.id
      //   },
      // });

      res.redirect("/perfil/usuario");
    } catch (error) {
      mensajes.push({
        error:
          "Ha ocurrido un error interno en el servidor. Comunicate con el personal de Invictus Development.",
        type: "alert-warning",
      });
    }
  }
};

exports.enterUsuario = async (req, res, next) => {
  const usuario = res.locals.usuario;

  try {
    // Obtener el producto mediante la URL
    const tienda = await Usuario.findOne({
      where: {
        url: req.params.url,
      },
    });
    const productos = await Producto.findAll({
      where: {
        usuarioId: tienda.id,
      },
    });

    const productosArray = [];

    productos.map((producto) => {
      productosArray.push({
        id: producto.dataValues.id,
        nombre: producto.dataValues.nombre,
        descripcion: producto.dataValues.descripcion,
        imagen: producto.dataValues.imagen,
        imagen2: producto.dataValues.imagen2,
        precio: producto.dataValues.precio,
        talla: producto.dataValues.talla,
        cantidad: producto.dataValues.cantidad,
        url: producto.dataValues.url,
      });
    });

    const us = await Usuario.findOne({
      where: {
        id: usuario.id,
      },
    });

    res.render("enterUsuario", {
      tienda: tienda.dataValues,
      us: us.dataValues,
      productos: productosArray,
    });
  } catch (error) {
    res.send(error);
    // res.redirect("/productos");
  }
};
