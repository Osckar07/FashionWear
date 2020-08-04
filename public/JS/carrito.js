const inicio = 0;

function subircantidad() {
  // const cantidad = document.getElementById('cantidad').value = ++inicio;

  const x = parseInt(document.getElementById("cantidad").value);
  x = x + contador;
  document.getElementById("cantidad").innerHTML = x;
}

function bajarcantidad() {
  const cantidad = (document.getElementById("cantidad").value = --inicio);
}
