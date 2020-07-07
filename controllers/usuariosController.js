// Importar el modelo de usuario
const Usuario = require("../models/Usuario");

exports.formularioRegistrarse = (req, res, next) => {
    res.render("registrarse", {layout: "auth"});
};

exports.registrarse = async (req, res, next) => {
    // Obtener los datos de la nueva cuenta mediante destructuring
    const { nombre, apellido, email, password } = req.body;

    const tipoUsuario = verificarTipoUsuario(password);    

    console.log("tipo de usuario", tipoUsuario);

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

    //Verificar si existe algun mensaje
    const {mensajes} = res.locals.mensajes;

    // console.log(mensajes);
    res.render("iniciar_sesion", {layout: "auth",mensajes});
};

// Función que nos servirá a verificar si al registrarse un usuario admin posee la contraseña maestra para los admin
function verificarTipoUsuario(pass){
    if(pass == "invictus"){
        return 0;
    } else {
        return 1;
    }
};

