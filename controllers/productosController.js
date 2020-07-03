// Importar los modelos necesarios
const Proyecto = require("../models/Producto");

// Muestra todos los productos
exports.inicioProductos= (req, res, next) => {
  res.render("inicio");
};
