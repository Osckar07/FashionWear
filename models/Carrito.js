//Importamos Sequelize
const Sequelize = require("sequelize");
//Importamos configuración a la base de datos
const db = require("../config/db");

//Importamos slug
const slug = require("slug");
//Importamos shortid
const shortid = require("shortid");

//Definicion del modelo
const Carrito = db.define("carrito", {
  idCarrito: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = Carrito;