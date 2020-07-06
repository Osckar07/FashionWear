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

//Importar cookie-parser oara habilitar el manejp de cokies en el sitio
const cookieParser = require("cookie-parser");

//importar connect-flash para disponer de los errores en todo el sitio
const flash = require("connect-flash");

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

//Habilitar el uso de connect-flash para compartir mensajes
app.use(flash());

//Habilitar el uso de cookie-parser
app.use(cookieParser());

//Habilitar las sesiones de usuario
app.use(session({
  secret: process.env.SESSIONSECRET,
  resave: false,
  saveUninitialized: false
})
);

// Crear una instancia de passport y cargar nuestra estrategia
app.use(passport.initialize());
app.use(passport.session());

//Pasar algunos valores mediante el middleware
app.use((req, res, next)=>{
  //Pasar el usuario a variables locales de la petición
  res.locals.usuario = { ...req.user} || null;

  res.locals.categoria = { ...req.categoria} || null;

  app.locals.categoria = req.categoria;

  app.locals.user = req.user;
  //Pasar los mensajes a las variables locales de la peticón
  res.locals.mensajes = req.flash();

  //Continuar con el camino del middleware
  next();
});


// Le indicamos a express dónde están las rutas del servidor
app.use("/", routes());

//inicializamos el servidor en el puerto 5000
app.listen(5000,() =>{
    console.log("Servidor iniciado, puerto 5000")
});