//Importamos Sequelize
const Sequelize = require("sequelize");
//Importamos configuracion de la base de datos
const db = require("../config/db");
//importar modelo factura
const Factura = require("./Factura");

//importar modelo Producto
const Producto = require("./Producto");

//importamos bcrypt-nodejs
const bcrypt = require("bcrypt-nodejs");

//Importamos slug
const slug = require("slug");
//Importamos shortid
const shortid = require("shortid");

//Definicion del modelo
const Usuario = db.define(
  "usuario",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipoUsuario: {
      type: Sequelize.INTEGER,
    },
    imagen: {
      type: Sequelize.STRING,
    },
    nombre: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Debes ingresar tu nombre",
        },
      },
    },
    apellido: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Debes ingresar tu apellido",
        },
      },
    },
    telefono: {
      type: Sequelize.STRING(15),      
    },
    direccion: {
      type: Sequelize.STRING(150),      
    },
    url: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: {
        args: true,
        msg: "Ya existe un usuario registrado con esta dirección de correo",
      },
      validate: {
        notEmpty: {
          msg: "Debes ingresar un correo electrónico",
        },
        isEmail: {
          msg: "Verifica que tu correo es un correo valido",
        },
      },
    },
    password: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Debe ingresar una contraseña",
        },
      },
    },
    token: Sequelize.STRING,
    expiration: Sequelize.DATE,
  },
  {
    //Instalamos una dependencia  bcrypt-nodejs
    hooks: {
      beforeCreate(usuario) {
        //Realizar el hash del password
        usuario.password = bcrypt.hashSync(
          usuario.password,
          bcrypt.genSaltSync(13)
        );
        console.log("Antes de insertar en la base de datos");
        const url = slug(usuario.nombre).toLowerCase();

        usuario.url = `${url}_${shortid.generate()}`;

      },              
      beforeUpdate(usuario) {
        console.log("Antes de actualizar la base");
        const url = slug(usuario.nombre).toLowerCase();

        usuario.url = `${url}_${shortid.generate()}`;
      }
    },
  }
);

//Definir que el usuario tiene muchos productos
Usuario.hasMany(Producto);
//Definir que el usuario tiene muchas facturas
Usuario.hasMany(Factura);

//Metodo personalizado
//Verificar si el password enviado (sin hash) es igual al almacenado(hash)
Usuario.prototype.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = Usuario;
