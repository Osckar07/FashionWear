//Importamos el modulo de express
const express = require("express");

//Creamos el servidor de express
const app = express();

//inicializamos el servidor en el puerto 3000
app.listen(3000,() =>{
    console.log("Servidor iniciado")
});