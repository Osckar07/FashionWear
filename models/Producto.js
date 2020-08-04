//Importamos Sequelize
const Sequelize = require("sequelize");
//Importamos configuración a la base de datos
const db = require("../config/db");
//Importamos modelo factura
const Factura = require("./Factura");

const Carrito = require("./Carrito");

// const Categoria = require("./Categoria");

//Importamos slug
const slug = require("slug");
//Importamos shortid
const shortid = require("shortid");

//Definicion del modelo
const Producto = db.define(
  "producto",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Debes ingresar el nombre",
        },
      },
    },
    descripcion: {
      type: Sequelize.STRING(140),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Debes ingresar una descripción",
        },
      },
    },
    tipoProducto: {
      type: Sequelize.STRING,
    },
    imagen: {
      type: Sequelize.STRING,
    },
    imagen2: {
      type: Sequelize.STRING,
    },
    cantidad: {
      type: Sequelize.INTEGER,
    },
    talla: {
      type: Sequelize.STRING,
    },
    precio: {
      type: Sequelize.DOUBLE,
    },
    url: {
      type: Sequelize.STRING,
    },
  },
  {
    hooks: {
      //Instalamos dependencias slug shortid
      beforeCreate(producto) {
        console.log("Antes de insertar en la base de datos");
        const url = slug(producto.nombre).toLowerCase();

        producto.url = `${url}_${shortid.generate()}`;
      },
      beforeUpdate(producto) {
        console.log("Antes de actualizar la base");
        const url = slug(producto.nombre).toLowerCase();

        producto.url = `${url}_${shortid.generate()}`;
      }
    },
  }
);

// Producto.hasOne(Categoria);

//Definimos que producto tendra una categoria
Producto.hasOne(Factura);

Producto.hasMany(Carrito);

module.exports = Producto;
