const socket = io();

socket.on("product", (product) => {

  const tbody = document.getElementById("productosBody");
  tbody.innerHTML = "";

  product.map((product) => {
    const row = tbody.insertRow();

    row.innerHTML = `         
     <td>${product._id}</td>
    <td>${product.title}</td>
    <td>${product.description}</td>
    <td>${product.price}</td>
    <td>${product.thumbnail > 0 ? product.thumbnail[0] : "No hay imagen"}</td> 
    <td>${product.code}</td>
    <td>${product.stock}</td>
    <td>${product.status ? "Activo" : "Desactivado"}</td>
    <td> ${product.category}</td>`;
  });
});

const formulario = document.getElementById("productForm");

formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const description = document.getElementById("descripcion").value;
  const precio = document.getElementById("precio").value;
  const codigo = document.getElementById("codigo").value;
  const stock = document.getElementById("stock").value;
  const categoria = document.getElementById("categoria").value;

  const product = {
    title: titulo,
    description: description,
    price: precio,
    code: codigo,
    stock: stock,
    category: categoria,
  };

  socket.emit("agregarProducto", product);
  

  formulario.reset()
});
