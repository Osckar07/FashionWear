// Importar los modelos necesarios
const Producto = require("../models/Producto");
const Categoria = require("../models/Categoria");
const Usuario = require("../models/Usuario");
const Carrito = require("../models/Carrito");
const { userEnter } = require("./usuariosController");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.nuevoCarrito = async (req, res, next) => {
  const usuario = res.locals.usuario;
  const mensajes = [];
  try {
    // Obtener el producto mediante la URL
    const producto = await Producto.findOne({
      where: {
        url: req.params.url,
      },
    });

    productoId = producto.id;
    usuarioId = usuario.id;

    await Carrito.create({
      productoId,
      usuarioId,
    });

    const tienda = await Usuario.findOne({
      where: {
        id: producto.usuarioId,
      },
    });
    const cat = await Categoria.findOne({
      where: {
        id: producto.categoriumId,
      },
    });

    mensajes.push({
      error: "Producto agregado al carrito",
      type: "alert-success",
    });

    res.render("ver_producto", {
      producto: producto.dataValues,
      tienda: tienda.dataValues,
      cat: cat.dataValues,
      mensajes,
      admin: usuario.tipoUsuario == 0 ? true : false,
      prodPer: producto.usuarioId == usuario.id ? true : false,
    });
  } catch (error) {
    res.redirect("/productos");
  }
};

// Muestra todos los productos del carrito
exports.mostrarCarrito = async (req, res, next) => {
  const usuario = res.locals.usuario;
  const mensajes = [];

  try {
    const us = await Usuario.findOne({
      where: {
        id: usuario.id,
      },
    });

    const productosCarrito = await Carrito.findAll({
      where: {
        usuarioId: usuario.id,
      },
    });

    const productosCarritoArray = [];

    productosCarrito.map((productoCarrito) => {
      productosCarritoArray.push({
        id: productoCarrito.dataValues.id,
        productoId: productoCarrito.dataValues.productoId,
        usuarioId: productoCarrito.dataValues.usuarioId,
      });
    });
    const productosArray = [];

    for (const p in productosCarritoArray) {
      const producto = await Producto.findOne({
        where: {
          id: productosCarritoArray[p].productoId,
        },
      });
      productosArray.push({
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        imagen: producto.imagen,
        imagen2: producto.imagen2,
        precio: producto.precio,
        talla: producto.talla,
        cantidad: producto.cantidad,
        url: producto.url,
      });
    }
    const acu = [];
    for (const i in productosArray) {
      acu.push(parseInt(productosArray[i].precio));
    }

    const total = acu.reduce((a, b) => a + b, 0);

    res.render("carrito", {
      // productosCarrito,
      productos: productosArray,
      total,
      us: us.dataValues,
      admin: usuario.tipoUsuario == 0 ? true : false,
      infoIncompletaMensaje:
        us.telefono == null || us.direccion == null ? true : false,
    });
  } catch (error) {
    mensajes.push({
      error: "Error al obtener los productos del carrito. Favor reintentar.",
      type: "alert-warning",
    });
    res.render("inicio", mensajes);
  }
};

exports.eliminarproductoCarrito = async (req, res, next) => {
  const usuario = res.locals.usuario;
  const mensajes = [];
  try {
    // Obtener el producto mediante la URL
    const productoE = await Producto.findOne({
      where: {
        url: req.params.url,
      },
    });

    productoId = productoE.id;
    usuarioId = usuario.id;

    await Carrito.destroy({
      where: {
        productoId,
        usuarioId,
      },
    });

    const us = await Usuario.findOne({
      where: {
        id: usuario.id,
      },
    });

    const productosCarrito = await Carrito.findAll({
      where: {
        usuarioId: usuario.id,
      },
    });

    const productosCarritoArray = [];

    productosCarrito.map((productoCarrito) => {
      productosCarritoArray.push({
        id: productoCarrito.dataValues.id,
        productoId: productoCarrito.dataValues.productoId,
        usuarioId: productoCarrito.dataValues.usuarioId,
      });
    });
    const productosArray = [];

    for (const p in productosCarritoArray) {
      const producto = await Producto.findOne({
        where: {
          id: productosCarritoArray[p].productoId,
        },
      });
      productosArray.push({
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        imagen: producto.imagen,
        imagen2: producto.imagen2,
        precio: producto.precio,
        talla: producto.talla,
        cantidad: producto.cantidad,
        url: producto.url,
      });
    }
    mensajes.push({
      error: "Producto eliminado del carrito",
      type: "alert-danger",
    });

    res.render("carrito", {
      // productosCarrito,
      productos: productosArray,
      mensajes,
      us: us.dataValues,
      admin: usuario.tipoUsuario == 0 ? true : false,
      infoIncompletaMensaje:
        us.telefono == null || us.direccion == null ? true : false,
    });
  } catch (error) {
    res.redirect("/productos");
  }
};
