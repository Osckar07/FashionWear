// Importar el modelo de usuario
const Usuario = require("../models/Usuario");

exports.formularioRegistrarse = (req, res, next) => {
    res.render("registrarse", {layout: "auth"});
};

exports.registrarse = async (req, res, next) => {
    // Obtener los datos de la nueva cuenta mediante destructuring
    const { nombre, apellido, email, password } = req.body;

    const tipoUsuario = 1;    
        
    // Intentar crear el usuario
    try{
        await Usuario.create({
            tipoUsuario,                       
            nombre,
            apellido,
            email,
            password
        });        
        // Redireccionar el usuario al formulario de inicio de sesión
        res.redirect("iniciar_sesion");
    } catch(error){
        //console.log(tipoUsuario, nombre, apellido, email, password);
        // res.render("registrarse");
        res.render("registrarse", {layout: "auth" }, {
            error
        });
    }
};

exports.formularioInicioSesion = (req, res, next) =>{
    res.render("iniciar_sesion", {layout: "auth"});
}
