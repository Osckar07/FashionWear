function cargar_tallas() {
  var zap = document.getElementsByName("tipoProducto")[0];
  var sel1 = zap.selectedIndex;
  var sel = zap[zap.selectedIndex].text;

  if (sel == "Zapatos") {
    var array = [];
    for (var c = 28; c < 47; c++) {
      array.push(c);
    }
  } else if (sel == "Pantalón") {
    var array = [];
    for (var c = 14; c < 41; c++) {
      array.push(c);
      c = c + 1;
    }
  } else if (sel == "Camisa") {
    var array = [
      "12",
      "14",
      "16",
      "18",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "3XL",
    ];
  } else if (sel == "Accesorios") {
    var array = ["Pequeño", "Mediano", "Grande"];
  }

  addOptions("talla", array);
}

// Rutina para agregar opciones a un <select>
function addOptions(domElement, array) {
  var select = document.getElementsByName(domElement)[0];

  for (var i = 1; i < select.length; i++) {
    select.options.remove(i);
    i--;
  }

  for (value in array) {
    var option = document.createElement("option");
    option.text = array[value];
    select.add(option);
  }
}
