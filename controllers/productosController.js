// Importar los modelos necesarios
const Producto = require("../models/Producto");
const Categoria = require("../models/Categoria");

// Muestra todos los productos
exports.inicioProductos= (req, res, next) => {
  res.render("inicio");
};

exports.formularioNuevoProducto = async (req, res, next) => {

  // const talla = [XS, S, M, L, XL, XXL, XXXL];
  
  // Traeremos de la base de datos todas las categorias disponibles, servirán para realacionarla con el producto
  try {
    const categoria = await Categoria.findAll();
    return res.render("crear_producto", {categoria});
  } catch (error) {
    // Crear el mensaje de error
    mensajes.push({
      error: "Error al obtener las categorias. Favor reintentar.",
      type: "alert-warning",
    });

    res.render("inicio", mensajes);
  }

};

exports.nuevoProducto = async (req, res, next) => {
  // Obtener el usuario actual
  const usuario = res.locals.usuario;
  const cat = res.locals.categoria;

  // Validar que el input del formulario tenga valor
  // Para acceder a los valores y asignarlos en un solo paso
  // vamos a utilizar destructuring.
  const { nombre, descripcion, tipoProducto, talla, precio, categoria } = req.body;
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
      mensajes,
    });
  } else {
    try {
      
      categoriaId = categoria;
      console.log(categoriaId);
      // Insertar el producto a la base de datos
      await Producto.create({ nombre, descripcion, tipoProducto, talla, precio, usuarioId: usuario.id, categoriaId: categoria });
      console.log(nombre, descripcion, tipoProducto, talla, precio);
      mensajes.push({
        error: "Producto almacenado satisfactoriamente.",
        type: "alert-success",
      });

      res.redirect("/");
    } catch (error) {
      mensajes.push({
        error:
          "Ha ocurrido un error interno en el servidor. Comunicate con el personal de Invictus Development.",
        type: "alert-warning",
      });
    }
  }
};

// Obtener todos los proyectos
exports.mostrarProductos = async (req, res, next) => {
  // Obtener el usuario actual
  const usuario = res.locals.usuario;
  const mensajes = [];

  try {
    if(usuario.tipoUsuario == 0){
      const productos = await Producto.findAll({
        where: {
          usuarioId: usuario.id,
        }});
      return res.render("productos", { productos });
    }
    else{
      const productos = await Producto.findAll();
      return res.render("productos", { productos });
    }
    
    }
  catch (error) {
    // Crear el mensaje de error
    mensajes.push({
      error: "Error al obtener los proyectos. Favor reintentar.",
      type: "alert-warning",
    });

    res.render("productos", mensajes);
  }
};
