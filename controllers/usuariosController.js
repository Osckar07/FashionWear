// Importar el modelo de usuario
const Usuario = require("../models/Usuario");

exports.formularioRegistrarse = (req, res, next) => {
    res.render("registrarse", {layout: "auth"});
};

exports.formularioInicioSesion = (req, res, next) =>{
    res.render("iniciar_sesion", {layout: "auth"});
}
