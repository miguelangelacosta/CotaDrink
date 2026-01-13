/*************************
 * CONFIGURACIÓN
 *************************/
const DOMICILIO = 7000;
const NUMERO_NEGOCIO = "573175533775";

let carrito = [];
const cont = id => document.getElementById(id);

/*************************
 * NAV
 *************************/
function mostrarNav() { cont("navInferior").style.display = "flex"; }
function ocultarNav() { cont("navInferior").style.display = "none"; }

/*************************
 * PANTALLAS
 *************************/
function mostrar(id){
  document.querySelectorAll(".pantalla").forEach(p => p.classList.remove("activa"));
  cont(id).classList.add("activa");
  id === "login" ? ocultarNav() : mostrarNav();
}

/*************************
 * INGRESAR
 *************************/
function ingresar(){
  const check = cont("checkEdad");
  if(!check.checked){ alert("Debes confirmar que eres mayor de 18 años"); return; }
  localStorage.setItem("edadOK", "true");
  mostrar("menu");
  renderProductos(productos);
}

/*************************
 * SALIR
 *************************/
function salir(){
  localStorage.removeItem("edadOK");
  vaciarCarrito();
  mostrar("login");
}

/*************************
 * CARGA INICIAL
 *************************/
window.onload = () => {
  if(localStorage.getItem("edadOK") === "true"){
    mostrar("menu");
    renderProductos(productos);
  } else mostrar("login");
}

/*************************
 * RENDER PRODUCTOS
 *************************/
function renderProductos(lista){
  const div = cont("productos");
  div.innerHTML = "";

  lista.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="badge">✔ Agregado</div>
      <img src="${p.img}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>$${p.precio.toLocaleString()}</p>
      <button>Agregar</button>
    `;

    const btn = card.querySelector("button");
    btn.onclick = () => {
      agregarProducto(p.id);
      animarAgregar(card);
      efectoCard(card, btn);
    };

    div.appendChild(card);
  });
}

/*************************
 * AGREGAR PRODUCTO AL CARRITO
 *************************/
function agregarProducto(id){
  const producto = productos.find(p => p.id === id);
  const existente = carrito.find(p => p.id === id);

  if(existente) existente.cantidad++;
  else carrito.push({...producto, cantidad: 1});

  actualizarCarrito();
}

/*************************
 * SUMAR / RESTAR
 *************************/
function sumar(id){
  const p = carrito.find(p => p.id === id);
  if(p){ p.cantidad++; actualizarCarrito(); }
}

function restar(id){
  const i = carrito.findIndex(p => p.id === id);
  if(i >= 0){
    carrito[i].cantidad--;
    if(carrito[i].cantidad <= 0) carrito.splice(i,1);
    actualizarCarrito();
  }
}

/*************************
 * VACIAR CARRITO
 *************************/
function vaciarCarrito(){
  carrito = [];
  actualizarCarrito();
}

/*************************
 * ACTUALIZAR CARRITO
 *************************/
function actualizarCarrito(){
  const lista = cont("lista");
  const totalHTML = cont("total");

  lista.innerHTML = "";

  let subtotal = 0;

  carrito.forEach(p => {
    const totalProducto = p.precio * p.cantidad;
    subtotal += totalProducto;

    lista.innerHTML += `
      <div class="item-carrito">
        <span>${p.nombre} (${p.cantidad} x $${p.precio.toLocaleString()})</span>
        <span>$${totalProducto.toLocaleString()}</span>
        <div>
          <button onclick="restar(${p.id})">−</button>
          <button onclick="sumar(${p.id})">+</button>
        </div>
      </div>
    `;
  });

  const total = carrito.length > 0 ? subtotal + DOMICILIO : 0;

  totalHTML.innerHTML = carrito.length > 0
    ? `Subtotal: $${subtotal.toLocaleString()} <br>Domicilio: $${DOMICILIO.toLocaleString()} <br><strong>Total: $${total.toLocaleString()}</strong>`
    : "Carrito vacío";
}

/*************************
 * ENVIAR PEDIDO POR WHATSAPP
 *************************/
function enviarWhatsApp(){
  if(carrito.length === 0) return alert("Carrito vacío");

  const direccion = cont("direccion").value.trim();
  const pago = cont("pago").value;
  if(!direccion) return alert("Ingresa la dirección");

  let mensaje = "🍾 *CotaDrink - Pedido*\n\n";
  let subtotal = 0;

  carrito.forEach(p => {
    const totalProducto = p.precio * p.cantidad;
    subtotal += totalProducto;
    mensaje += `• ${p.nombre} (${p.cantidad} x $${p.precio.toLocaleString()}) = $${totalProducto.toLocaleString()}\n`;
  });

  const total = subtotal + DOMICILIO;

  mensaje += `\nSubtotal: $${subtotal.toLocaleString()}`;
  mensaje += `\nDomicilio: $${DOMICILIO.toLocaleString()}`;
  mensaje += `\n*Total: $${total.toLocaleString()}*`;
  mensaje += `\n\n📍 Dirección: ${direccion}`;
  mensaje += `\n💰 Pago: ${pago}`;
  mensaje += `\n🪪 Mayoría de edad verificada al entregar`;

  window.open(`https://wa.me/${NUMERO_NEGOCIO}?text=${encodeURIComponent(mensaje)}`, "_blank");
}

/*************************
 * ANIMACIONES CARD
 *************************/
function animarAgregar(card){
  const img = card.querySelector("img");
  const cart = cont("btnCarrito");
  if(!img || !cart) return;

  const imgRect = img.getBoundingClientRect();
  const cartRect = cart.getBoundingClientRect();

  const clone = img.cloneNode(true);
  clone.style.position = "fixed";
  clone.style.left = imgRect.left + "px";
  clone.style.top = imgRect.top + "px";
  clone.style.width = imgRect.width + "px";
  clone.style.height = imgRect.height + "px";
  clone.style.zIndex = 9999;
  clone.style.transition = "all .6s ease";

  document.body.appendChild(clone);

  requestAnimationFrame(()=>{
    clone.style.left = cartRect.left + cartRect.width/2 + "px";
    clone.style.top = cartRect.top + "px";
    clone.style.width = "20px";
    clone.style.height = "20px";
    clone.style.opacity = "0.3";
  });

  setTimeout(()=> clone.remove(), 600);
}

/*************************
 * EFECTO CARD
 *************************/
function efectoCard(card, btn){
  card.classList.add("agregado");
  btn.classList.add("agregado");

  setTimeout(()=>{
    card.classList.remove("agregado");
    btn.classList.remove("agregado");
  },700);
}

/*************************
 * FILTROS
 *************************/
function filtrar(cat){
  if(cat === "todos") renderProductos(productos);
  else renderProductos(productos.filter(p => p.categoria === cat));
}
  

function buscarProducto() {
  const texto = document.getElementById("busqueda").value.toLowerCase();
  const contenedor = document.getElementById("productos");

  contenedor.innerHTML = "";

  productos
    .filter(p => p.nombre.toLowerCase().includes(texto))
    .forEach(p => {
      contenedor.innerHTML += `
        <div class="card">
          <img src="${p.imagen}">
          <h3>${p.nombre}</h3>
          <p>$${p.precio}</p>
          <button onclick="agregar(${p.id})">Agregar</button>
        </div>
      `;
    });
}
