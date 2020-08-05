// Importar passport
const passport = require("passport");
// Utilizar la estrategia local
const LocalStrategy = require("passport-local");
//Instalación de la dependencia passport-Facebook
//Utilizamos la estrategia passport-Facebook
const FacebookStrategy = require("passport-facebook")
// Importar la referencia al modelo que contiene los datos de autenticación
const Usuario = require("../models/Usuario");

// Importar el sequelize
const Sequelize = require("sequelize");

// Definir nuestra estrategia de autencitación
// Local Strategy --> realizar un login con credenciales propias (user, pass)
passport.use(
  new LocalStrategy(
    // Por defecto passport en LocalStrategy requiere de un usuario y una contraseña
    {
      usernameField: "email",
      passwordField: "password",
    },
    // Verificar si los datos enviados por el usuario son correctos
    async (email, password, done) => {
      try {
        // Realizar la búsqueda del usuario
        const usuario = await Usuario.findOne({
          where: { email },
        });

        // Si el usuario existe, verificar si su contraseña es correcta
        if (!usuario.comparePassword(password)) {
          return done(null, false, {
            message: "Nombre de usuario o contraseña incorrecta",
          });
        }

        // El usuario y la contraseña son correctas
        return done(null, usuario);
      } catch (error) {
        // El usuario no existe
        return done(null, false, {
          message: "La cuenta de correo electrónico no se encuentra registrada",
        });
      }
    }
  )
);


//Estrategia con faceboock
//Pemisos para fb https://developers.facebook.com/docs/facebook-login/web/permissions/?locale=es_ES
passport.use(
  new FacebookStrategy(
    {
      //Datos necesarios para poder obtener los datos por medio de facebook
      clientID: process.env.IDAPLICACIONFB,
      clientSecret: process.env.CLAVESECRETAFB,
      callbackURL: "/auth/facebook/callback",
      scope : ['email'],
      profileFields: ['id', 'email', 'first_name', 'last_name', 'picture']

    }, async (accessToken, refreshToken, profileFields, done) => {
      const tipoUsuario = 1; 
      const imagen =profileFields.photos[0].value
      const nombre = profileFields.name.givenName
      const apellido = profileFields.name.familyName
      const email = profileFields.emails[0].value
      const password = profileFields.id

          //Verificamos si el usuario existe
          const usuario = await Usuario.findOne({
            where: { email },
          });

          if(!usuario){
            //Si el usuario no existe lo creamos en la base de datos

            try{
           
            await Usuario.create({
                tipoUsuario,    
                imagen,                   
                nombre,
                apellido,
                email,
                password
              });      
              return done(null,usuario);
              } catch(error){
                  //console.log(tipoUsuario, nombre, apellido, email, password);
                  console.log(error)
              };
          }
            
            return done(null,usuario);

          
    
    }));



// Permitir que passport lea los valores del objeto usuario
// Serializar el usuario
passport.serializeUser((usuario, callback) => {
  callback(null, usuario);
});

// Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario);
});

module.exports = passport;