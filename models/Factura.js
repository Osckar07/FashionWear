//Importamos Sequelize
const Sequelize = require("sequelize");
//Importamos configuracion de la base de datos
const db = require("../config/db");


//Definicion de modelo
const Factura = db.define(
    "factura", 
        {
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cantidad:{
            type: Sequelize.INTEGER
        },
        precioTotal:{
            type: Sequelize.DOUBLE
        },
    }
);

module.exports = Factura;
