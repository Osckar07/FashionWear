//Importamos Sequelize
const Sequelize = require("sequelize");
//Importamos configuracion de la base de datos
const db = require("../config/db");
//importamos bcrypt-nodejs
const bcrypt = require("bcrypt-nodejs");
//importar modelo factura
const Factura = require("./Factura");

//Definicion del modelo
const Usuario = db.define("usuario",{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipoUsuario:{
        type: Sequelize.INTEGER
    },
    imagen:{
        type: Sequelize.STRING
    },
    nombre:{
        type: Sequelize.STRING(50)
    },
    Apellido:{
        type:Sequelize.STRING(50)
    },
    email:{
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: {
            args: true,
            msg: "Ya existe un usuario registrado con esta dirección de correo"
        },
        validate:{
            notEmpty:{
                msg: "Debes ingresar un correo electrónico"
            },
            isEmail:{
                msg: "Verifica que tu correo es un correo valido"
            }
        }
    },
    password: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate:{
            notEmpty: {
                msg: "Debe ingresar una contraseña"
            }
        }
    },
    token: Sequelize.STRING,
    expiration: Sequelize.DATE,
    
},{
       //Instalamos una dependencia  bcrypt-nodejs
       hooks:{
           beforeCreate(usuario){
               //Realizar el hash del password
               usuario.password = bcrypt.hashSync(
                   usuario.password, 
                   bcrypt.genSaltSync(13))
           }
       }

});

//Definir que el usuario tiene muchos proyectos
Usuario.hasMany(Factura);

//Metodo personalizado
//Verificar si el password enviado (shin hash) es igual al almacenado(hash)
Usuario.prototype.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = Usuario;