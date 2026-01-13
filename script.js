// ================= ESTADO =================
let carrito = []
let categoriaActual = 'todos'
const DOMICILIO = 7000

const $ = id => document.getElementById(id)

// ================= NAVEGACION =================
function mostrar(id) {
  document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'))
  $(id).classList.add('activa')

  // Mostrar nav solo en menú y carrito
  const nav = $('navInferior')
  nav.style.display = (id === 'menu' || id === 'orden') ? 'flex' : 'none'
}

// ================= LOGIN =================
function ingresar() {
  if (!$('checkEdad').checked) {
    alert('Debes ser mayor de edad')
    return
  }
  mostrar('menu')
  renderProductos()

  // Mostrar botón flotante
  $('botonCarrito').style.display = 'flex'
}

function salir() {
  carrito = []
  actualizarCarrito()
  mostrar('login')

  // Ocultar botón flotante
  $('botonCarrito').style.display = 'none'
}

// ================= PRODUCTOS =================
function renderProductos(texto = '') {
  const cont = $('productos')
  cont.innerHTML = ''

  productos
    .filter(p => categoriaActual === 'todos' || p.categoria === categoriaActual)
    .filter(p => p.nombre.toLowerCase().includes(texto.toLowerCase()))
    .forEach(p => {
      cont.innerHTML += `
        <div class="card">
          <img src="${p.img}" alt="${p.nombre}">
          <h3>${p.nombre}</h3>
          <p>$${p.precio}</p>
          <button onclick="agregar(${p.id}, this)">Agregar</button>
        </div>
      `
    })
}

// ================= FILTROS Y BUSCADOR =================
function filtrar(cat) {
  categoriaActual = cat
  document.querySelectorAll('.filtros button').forEach(b => b.classList.remove('active'))
  event.target.classList.add('active')
  renderProductos()
}

function buscarProducto(texto) {
  renderProductos(texto)
}

// ================= CARRITO =================
function agregar(id, btn) {
  const prod = productos.find(p => p.id === id)
  const existe = carrito.find(p => p.id === id)

  if (existe) {
    existe.cantidad++
  } else {
    carrito.push({ ...prod, cantidad: 1 })
  }

  // Animación producto → carrito
  animarCarrito(btn)

  actualizarCarrito()
}

function cambiarCantidad(id, cambio) {
  const item = carrito.find(p => p.id === id)
  if (!item) return

  item.cantidad += cambio
  if (item.cantidad <= 0) carrito = carrito.filter(p => p.id !== id)
  actualizarCarrito()
}

function actualizarCarrito() {
  const lista = $('lista')
  lista.innerHTML = ''

  let subtotal = 0
  carrito.forEach(p => {
    const totalItem = p.precio * p.cantidad
    subtotal += totalItem

    lista.innerHTML += `
      <div class="item-carrito">
        <span>${p.nombre}</span>
        <div class="cantidad">
          <button onclick="cambiarCantidad(${p.id}, -1)">−</button>
          <strong>${p.cantidad}</strong>
          <button onclick="cambiarCantidad(${p.id}, 1)">+</button>
        </div>
        <strong>$${totalItem}</strong>
      </div>
    `
  })

  // Totales
  $('subtotal').textContent = subtotal
  $('domicilio').textContent = carrito.length ? DOMICILIO : 0
  $('total').textContent = carrito.length ? subtotal + DOMICILIO : 0

  // Actualizar botón flotante
  $('cantidadCarrito').textContent = carrito.reduce((acc, p) => acc + p.cantidad, 0)
}

// Vaciar carrito
function vaciarCarrito() {
  carrito = []
  actualizarCarrito()
}

// ================= WHATSAPP =================
function enviarWhatsApp() {
  if (!carrito.length) {
    alert('El carrito está vacío')
    return
  }

  const dir = $('direccion').value.trim()
  const pago = $('pago').value

  if (!dir) {
    alert('Ingresa la dirección')
    return
  }

  let subtotal = 0
  let msg = `🛒 *Pedido CotaDrink*%0A%0A`

  carrito.forEach(p => {
    const totalItem = p.precio * p.cantidad
    subtotal += totalItem
    msg += `• ${p.nombre} x${p.cantidad} - $${totalItem}%0A`
  })

  msg += `%0A🚚 Domicilio: $${DOMICILIO}`
  msg += `%0A💵 Total: $${subtotal + DOMICILIO}`
  msg += `%0A📍 Dirección: ${dir}`
  msg += `%0A💰 Pago: ${pago}`

  window.open(`https://wa.me/573175533775?text=${msg}`, '_blank')
}

// ================= ANIMACION PRODUCTO =================
function animarCarrito(btn) {
  const img = btn.parentElement.querySelector('img')
  const imgClone = img.cloneNode(true)
  const rect = img.getBoundingClientRect()
  imgClone.style.position = 'fixed'
  imgClone.style.left = rect.left + 'px'
  imgClone.style.top = rect.top + 'px'
  imgClone.style.width = rect.width + 'px'
  imgClone.style.height = rect.height + 'px'
  imgClone.style.transition = 'all 0.7s ease-in-out'
  imgClone.style.zIndex = 1000
  document.body.appendChild(imgClone)

  const cartIcon = document.querySelector('#botonCarrito')
  const cartRect = cartIcon.getBoundingClientRect()

  setTimeout(() => {
    imgClone.style.left = cartRect.left + 'px'
    imgClone.style.top = cartRect.top + 'px'
    imgClone.style.width = '0px'
    imgClone.style.height = '0px'
    imgClone.style.opacity = '0'
  }, 10)

  setTimeout(() => {
    imgClone.remove()
  }, 800)
}

// ================= INICIO =================
mostrar('login')



// Mostrar mensaje por 3 segundos
const mensaje = $('mensajeSistema');
mensaje.textContent = "🍹 ¡Bienvenido a CotaDrink! Explora productos, agrégalos al carrito y recibe tu pedido en casa en minutos.";
mensaje.style.opacity = '1';

setTimeout(() => {
  mensaje.style.opacity = '0';
}, 3000);
