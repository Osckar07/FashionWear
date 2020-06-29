//Importamos el modulo de express
const express = require("express");

//Importamos el express-handlebars
const exphbs = require("express-handlebars");

// Importamos las rutas que estén disponibles
const routes = require("./routes");

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

// Mediante handlebars indicamos el template engine a utilizar
app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

// Le indicamos a express dónde están las rutas del servidor
app.use("/", routes());

//inicializamos el servidor en el puerto 5000
app.listen(5000,() =>{
    console.log("Servidor iniciado, puerto 5000")
});