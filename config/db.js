//Instalamos la extención de sequelize
//Importamos Sequelize
const Sequelize = require("sequelize");

//Instalamos la extención de dotenv
//Instalamos la extención de mysql2
//Importar libreria dotenv
require("dotenv").config({ path: "variables.env"});


//Establecer los parametros de la  conexión a la base de datos
const db = new Sequelize("fashionweardb", process.env.MYSQLUSER, process.env.MYSQLPASS,{
    host: process.env.MYSQLHOST,
    dialect: "mysql",
    port: process.env.MYSQLPORT,
    operatorAliases: false,
    define: {
        timestamps:false
    },
    pool:{
        max:  10,
        min: 0,
        acquire:30000,
        idle:10000
    }
});

module.exports = db;