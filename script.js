// ================= ESTADO =================
let carrito = []
let categoriaActual = 'todos'
const DOMICILIO = 7000
const $ = id => document.getElementById(id)

// ================= NAVEGACION =================
function mostrar(id) {
  document.querySelectorAll('.pantalla')
    .forEach(p => p.classList.remove('activa'))

  $(id).classList.add('activa')

  const nav = $('navInferior')
  if (nav) {
    nav.style.display = (id === 'menu' || id === 'orden') ? 'flex' : 'none'
  }
}

// ================= LOGIN =================
function ingresar() {
  if (!$('checkEdad').checked) {
    alert('Debes ser mayor de edad')
    return
  }
  mostrar('menu')
  renderProductos()
  $('botonCarrito').style.display = 'flex'
}

function salir() {
  carrito = []
  actualizarCarrito()
  mostrar('login')
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

      const itemCarrito = carrito.find(i => i.id === p.id)
      const cantidad = itemCarrito ? itemCarrito.cantidad : 1

      cont.innerHTML += `
        <div class="card">
          <img src="${p.img}" alt="${p.nombre}">
          <h3>${p.nombre}</h3>

          <div class="fila-precio">
            <p>$${p.precio}</p>

            <div class="cantidad-card">
              <button onclick="cambiarCantidadCard(${p.id}, -1)">−</button>
              <span id="cantidad-card-${p.id}">${cantidad}</span>
              <button onclick="cambiarCantidadCard(${p.id}, 1)">+</button>
            </div>
          </div>

          <button onclick="agregarConCantidad(${p.id}, this)">Agregar</button>
        </div>
      `
    })
}

// ================= CANTIDAD EN CARD =================
function cambiarCantidadCard(id, cambio) {
  const span = document.getElementById(`cantidad-card-${id}`)
  if (!span) return

  let valor = parseInt(span.textContent) + cambio
  if (valor < 1) valor = 1
  span.textContent = valor
}

// ================= AGREGAR DESDE CARD =================
function agregarConCantidad(id, btn) {
  const prod = productos.find(p => p.id === id)
  const cantidad = parseInt(
    document.getElementById(`cantidad-card-${id}`).textContent
  )

  const existe = carrito.find(p => p.id === id)

  if (existe) {
    existe.cantidad += cantidad
  } else {
    carrito.push({ ...prod, cantidad })
  }

  animarCarrito(btn)
  actualizarCarrito()
}

// ================= FILTROS =================
function filtrar(cat) {
  categoriaActual = cat
  document.querySelectorAll('.filtros button')
    .forEach(b => b.classList.remove('active'))

  event.target.classList.add('active')
  renderProductos()
}

function buscarProducto(texto) {
  renderProductos(texto)
}

// ================= CARRITO =================
function cambiarCantidad(id, cambio) {
  const item = carrito.find(p => p.id === id)
  if (!item) return

  item.cantidad += cambio
  if (item.cantidad <= 0) {
    carrito = carrito.filter(p => p.id !== id)
  }

  actualizarCarrito()
  renderProductos()
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
        <img src="${p.img}" alt="${p.nombre}">

        <div class="info">
          <h4>${p.nombre}</h4>
          <p>$${p.precio} x ${p.cantidad}</p>
        </div>

        <div class="cantidad">
          <button onclick="cambiarCantidad(${p.id}, -1)">−</button>
          <span>${p.cantidad}</span>
          <button onclick="cambiarCantidad(${p.id}, 1)">+</button>
        </div>

        <strong class="total">$${totalItem}</strong>
      </div>
    `
  })

  $('subtotal').textContent = subtotal
  $('domicilio').textContent = carrito.length ? DOMICILIO : 0
  $('total').textContent = carrito.length ? subtotal + DOMICILIO : 0
  $('cantidadCarrito').textContent =
    carrito.reduce((a, p) => a + p.cantidad, 0)
}

function vaciarCarrito() {
  carrito = []
  actualizarCarrito()
  renderProductos()
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

  let msg = `🛒 *Pedido CotaDrink*%0A%0A`
  let subtotal = 0

  carrito.forEach(p => {
    const totalItem = p.precio * p.cantidad
    subtotal += totalItem
    msg += `• ${p.nombre} x${p.cantidad} - $${totalItem}%0A`
  })

  msg += `%0A🚚 Domicilio: $${DOMICILIO}`
  msg += `%0A💵 Total: $${subtotal + DOMICILIO}`
  msg += `%0A📍 Dirección: ${dir}`
  msg += `%0A💰 Pago: ${pago}`

  window.open(
    `https://wa.me/573175533775?text=${msg}`,
    '_blank'
  )
}

// ================= ANIMACION =================
function animarCarrito(btn) {
  const img = btn.closest('.card').querySelector('img')
  const clone = img.cloneNode(true)
  const r = img.getBoundingClientRect()

  clone.style.position = 'fixed'
  clone.style.left = r.left + 'px'
  clone.style.top = r.top + 'px'
  clone.style.width = r.width + 'px'
  clone.style.transition = 'all .7s ease'
  clone.style.zIndex = 1000

  document.body.appendChild(clone)

  const cart = $('botonCarrito').getBoundingClientRect()

  setTimeout(() => {
    clone.style.left = cart.left + 'px'
    clone.style.top = cart.top + 'px'
    clone.style.width = '0'
    clone.style.opacity = '0'
  }, 10)

  setTimeout(() => clone.remove(), 800)
}

// ================= INICIO =================
mostrar('login')
