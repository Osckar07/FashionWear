// Importar el modelo de usuario
const Usuario = require("../models/Usuario");

exports.formularioRegistrarse = (req, res, next) => {
    res.render("registrarse");
};
