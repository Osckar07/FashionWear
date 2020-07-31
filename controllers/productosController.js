// Importar los modelos necesarios
const Producto = require("../models/Producto");
const Categoria = require("../models/Categoria");
const Usuario = require("../models/Usuario");
const { userEnter } = require("./usuariosController");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const path = require("path");
const cloudinary = require("cloudinary");
const fs = require("fs-extra");
const { fips } = require("crypto");

// Configuración para cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Muestra todos los productos
exports.inicioProductos = (req, res, next) => {
  const usuario = res.locals.usuario;  

  // Hará la verificación respectiva si el usuario es admin o no, para su posterior uso
  res.render("inicio", { admin: usuario.tipoUsuario == 0 ? true : false });
};

exports.formularioNuevoProducto = async (req, res, next) => {  
  
  try {
    // Traeremos de la base de datos todas las categorias disponibles, servirán para realacionarla con el producto
    const categoria = await Categoria.findAll();
    return res.render("crear_producto", { layout:"userEnter", categoria });
  } catch (error) {    
    mensajes.push({
      error: "Error al obtener las categorias. Favor reintentar.",
      type: "alert-warning",
    });

    res.render("productosAdmin", mensajes);
  }
};

exports.nuevoProducto = async (req, res, next) => {

  console.log(req.file);

  // Obtener el usuario actual
  const usuario = res.locals.usuario;
  const cat = res.locals.categoria;

  // Validar que el input del formulario tenga valor
  // Para acceder a los valores y asignarlos en un solo paso
  // vamos a utilizar destructuring.
  const {
    nombre,
    descripcion,
    tipoProducto,
    talla,
    precio,
    categoria,
  } = req.body;
  const mensajes = [];

  // const combo = document.getElementById("inputGroupSelect01");
  // const tipoProducto = combo.options[combo.selectedIndex].text;

  // console.log(nombre, descripcion, tipoProducto, talla, precio, categoria);

  console.log(req.body);

  // Verificar si el nombre del producto tiene un valor
  if (!nombre) {
    mensajes.push({
      error: "El nombre del producto no puede estar vacío.",
      type: "alert-danger",
    });
  }

  if (!descripcion) {
    mensajes.push({
      error: "La descripción del producto no puede estar vacía",
      type: "alert-danger",
    });
  }
  if (!tipoProducto || !talla || !precio || !categoria) {
    mensajes.push({
      error: "Debes completar todos los campos",
      type: "alert-danger",
    });
  }

  // Si hay errores
  if (mensajes.length) {
    res.render("crear_producto", { 
      categoria,
      layout: "userEnter",
      mensajes,
    });
  } else {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, (error, resulado)=>{console.log(resulado, error)});
      console.log(result);
      categoriumId = categoria
      console.log(categoriumId);
      // Insertar el producto a la base de datos
      await Producto.create({
        nombre,
        descripcion,
        tipoProducto,
        imagen: result.url,
        talla,
        precio,
        usuarioId: usuario.id,
        categoriumId,
      });
      await fs.unlink(req.file.path);
      console.log(nombre, descripcion, tipoProducto, talla, precio, categoriumId);
      mensajes.push({
        error: "Producto almacenado satisfactoriamente.",
        type: "alert-success",
      });

      res.redirect("productos_admin");
    } catch (error) {
      mensajes.push({
        error:
          "Ha ocurrido un error interno en el servidor. Comunicate con el personal de Invictus Development.",
        type: "alert-warning",
      });
    }
  }
};

// Obtener todos los productos
exports.mostrarProductos = async (req, res, next) => {
  // Obtener el usuario actual
  const usuario = res.locals.usuario;
  const mensajes = [];

  try {
    const productos = await Producto.findAll();    

    return res.render("productos", { productos });
  } catch (error) {
    // Crear el mensaje de error
    mensajes.push({
      error: "Error al obtener los productos. Favor reintentar.",
      type: "alert-warning",
    });
    res.render("productos", mensajes);
  }
};

exports.mostrarProductosAdmin = async (req, res, next) => {
  // Obtener el usuario actual
  const usuario = res.locals.usuario;
  const mensajes = [];

  try {
    const productos = await Producto.findAll({
      where: {
        usuarioId: usuario.id,
      },
    });
    return res.render("productosAdmin", {layout:"userEnter", productos });
  } catch (error) {
    // Crear el mensaje de error
    mensajes.push({
      error: "Error al obtener los productos. Favor reintentar.",
      type: "alert-warning",
    });

    res.render("productosAdmin", {layout:"userEnter", mensajes});
  }
};

// Busca un producto por su URL
exports.obtenerProductoPorUrl = async (req, res, next) => {
  // Obtener el usuario actual
  const usuario = res.locals.usuario;

  try {
    // Obtener el producto mediante la URL
    const producto = await Producto.findOne({
      where: {
        url: req.params.url,
      },
    });
    const tienda = await Usuario.findOne({
      where: {
        id: producto.usuarioId,
      },
    });    
    const cat = await Categoria.findOne({
      where: {
        id: producto.categoriumId,
      },
    }); 

    res.render("ver_producto", {
      producto: producto.dataValues, tienda: tienda.dataValues, cat: cat.dataValues
    });    
  } catch (error) {
    res.redirect("/productos");
  }
};

// Mostrar los datos y tareas del producto
exports.modificarProducto = async (req, res, next) => {
  try {
    // Obtener el producto desde su URL
    const producto = await Producto.findOne({
      where: {
        url: req.params.url,
      },
    });


    const categoria = await Categoria.findAll();     

    res.render("actualizar_producto", { layout:"userEnter",
      producto: producto.dataValues, categoria
    });
  } catch (error) {
    console.log("-------error_____-----");
    
    res.redirect("/productosAdmin");
  }
};

exports.actualizarProducto = async (req, res, next) => {
  // Validar que el input del formulario tenga valor
  // Para acceder a los valores y asignarlos en un solo paso
  // vamos a utilizar destructuring.
  const {
    nombre,
    descripcion,
    tipoProducto,
    talla,
    precio,
    categoria,
  } = req.body;

  // Obtener la información del usuario actual
  const usuario = res.locals.usuario;

  const mensajes = [];

  // Verificar si el nombre del producto es enviado
  if (!nombre) {
    mensajes.push({
      error: "¡El nombre del producto no puede ser vacío!",
      type: "alert-danger",
    });
  }

  // Verificar si la descripción del producto es enviada
  if (!descripcion) {
    mensajes.push({
      error: "¡La descripción del producto no puede ser vacía!",
      type: "alert-danger",
    });
  }

  if (!tipoProducto || !talla || !precio || !categoria) {
    mensajes.push({
      error: "Debes completar todos los campos",
      type: "alert-danger",
    });
  }

  // Si hay mensajes
  if (mensajes.length) {
    // Enviar valores correctos si la actualización falla
    const producto = await Producto.findByPk(req.params.id);
    const categori = await Categoria.findAll();    


    res.render("actualizar_producto", { layout:"userEnter",
      producto: producto.dataValues,
      categoria: categori,
      mensajes,
    });
  } else {
    // No existen errores ni mensajes
    try {
      await Producto.update(
        {
          nombre,
          descripcion,
          tipoProducto,
          talla,
          precio,
          usuarioId: usuario.id,
          categoriaId: categoria,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      // Redirigir hacia el home de productos
      res.redirect("/productos_admin");
    } catch (error) {
      mensajes.push({
        error:
          "Ha ocurrido un error interno en el servidor. Comunicate con el personal de Invictus Development.",
        type: "alert-warning",
      });
    }
  }
};

// Eliminar un Producto
exports.eliminarProducto = async (req, res, next) => {
  // Obtener la URL del Producto por destructuring query
  const { url } = req.query;

  // Tratar de eliminar el Producto
  try {
    await Producto.destroy({
      where: {
        url,
      },
    });

    // Si el Producto se puede eliminar sin problemas
    res.status(200).send("Producto eliminado correctamente");
  } catch (error) {
    // Si el Producto no se puede eliminar
    return next();
  }
};

exports.miTienda = (req, res, next) =>{
  res.render("userEnter", {layout:"auth"});
};

// buscar productos
exports.buscarProducto = async (req, res, next) => {
  // Obtener el usuario actual
  const usuario = res.locals.usuario;
  const mensajes = [];

  const { parametroBusqueda } = req.body;
  console.log(req.body);

  try {
    await Producto.findAll({
      where:{
        nombre: {
          [Op.like]: `%${parametroBusqueda}%`,
        },      
      },
    }).then(function (productos){
      productos = productos.map(function (producto) {        
        return producto;
      });
      // Renderizar solo si la promesa se cumple
      res.render("resultados_busqueda", { productos, parametroBusqueda });
    });
  } catch (error) {
    // Crear el mensaje de error
    mensajes.push({
      error: "Error al obtener los productos. Favor reintentar.",
      type: "alert-warning",
    });
    res.render("productos", mensajes);
  }  
};