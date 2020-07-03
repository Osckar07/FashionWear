//Importamos el modulo de express
const express = require("express");

//Importamos el express-handlebars
const exphbs = require("express-handlebars");

// Importar body parser que nos permite acceder al cuerpo de la peticion HTTP
const bodyParser = require("body-parser");

// Importamos las rutas que estén disponibles
const routes = require("./routes");

// Importar el passport para permitir el inicio de sesión
const passport = require("./config/passport");

//Instalamos cookie-parser, connect-flash: permite pasar mensajes de error y express-session
//Importamos express-session para manejar la sesion de usuario
const session = require("express-session");

//Importar cookie-parser oara habilitar el manejo de cokies en el sitio
const cookieParser = require("cookie-parser");

//Crear conexión con la base de datos
const db = require("./config/db");

//Instalamos cookie-parser, connect-flash: permite pasar mensajes de error y express-session

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

// Indicarle al servidor la carpeta de archivos estáticos
app.use(express.static("public"));

// Mediante handlebars indicamos el template engine a utilizar
app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

// Habilitar bodyParser para leer los datos enviados por POST
app.use(bodyParser.urlencoded({ extended: true }));

//Habilitar el uso de cookie-parser
app.use(cookieParser());

//Habilitar las sesiones de usuario
app.use(session({
  secret: process.env.SESSIONSECRECT,
  resave: false,
  saveUninitialized: false
})
);

// Crear una instancia de passport y cargar nuestra estrategia
app.use(passport.initialize());
app.use(passport.session());

//Pasar algunos valores mediante el middleware
app.use((req, res, next)=>{
  res.locals.usuario = { ...req.user} || null;
  next();
});

// Le indicamos a express dónde están las rutas del servidor
app.use("/", routes());

//inicializamos el servidor en el puerto 5000
app.listen(5000,() =>{
    console.log("Servidor iniciado, puerto 5000")
});
