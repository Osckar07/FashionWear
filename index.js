//Importamos el modulo de express
const express = require("express");

//Crear conexión con la base de datos
const db = require("./config/db");


//Importar los modelos
require("./models/Producto");
require("./models/Categoria");
require("./models/Usuario");
require("./models/Factura");

//Realizar la conexión a la base de datos
db.sync()
  .then(()=>console.log("Conectado con el servidor de DB"))
  .catch(error=> console.log(error));

//Creamos el servidor de express
const app = express();

//inicializamos el servidor en el puerto 3000
app.listen(3000,() =>{
    console.log("Servidor iniciado")
});