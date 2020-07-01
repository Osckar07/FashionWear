//Importamos Sequelize
const Sequelize = require("sequelize");
//importamos configuracion de la base de datos
const db = require("../config/db");

//Importamos el modelo producto
const Producto = require("./Producto");

//Importamos slug 
const slug = require("slug");
//Importamos shortid
const shortid = require("shortid");

//Definimos el modelo

const Categoria = db.define(
    "categoria",
    {
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre:{
            type: Sequelize.STRING
        },
        url:{
            type: Sequelize.STRING
        }
    },
    {
        hooks:{    
            beforeCreate(categoria){
                console.log("Antes de insertar en la base de datos");
                const url = slug(categoria.nombre).toLowerCase();

                categoria.url = `${url}_${shortid.generate()}`;
            },
            beforeCreate(categoria){
                console.log("Antes de actualizar la base");
                const url = slug(categoria.nombre).toLowerCase();

                categoria.url = `${url}_${shortid.generate()}`;
            },
        },
    }
);

Categoria.hasOne(Producto);

module.exports = Categoria;