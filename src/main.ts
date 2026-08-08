import './styles.css'
import { db } from './data/db'
import type { GuitarDTO } from './dtos/guitar.dto'
import type { CartItemDTO } from './dtos/cart-item.dto'

/**
 * Obtiene el carrito almacenado en localStorage o un arreglo vacío si no existe.
 */
function obtenerCarritoInicial(): CartItemDTO[] {
  try {
    const almacenado = localStorage.getItem('guitarla_carrito')
    return almacenado ? JSON.parse(almacenado) : []
  } catch {
    return []
  }
}

/**
 * Estado global del carrito. Cada ítem es una guitarra + su cantidad.
 */
let carrito: CartItemDTO[] = obtenerCarritoInicial()

/**
 * Construye el src de la imagen de una guitarra.
 *
 * La propiedad `image` viene SIN extensión (ej. "guitarra_01"), así que le
 * concatenamos ".jpg". Usamos `new URL(..., import.meta.url)` en lugar de un
 * string plano porque las imágenes viven en `src/img/`: un string relativo se
 * resolvería contra la URL del documento (la raíz) y daría 404. `import.meta.url`
 * ancla la ruta a este módulo (src/main.ts) y deja que Vite procese el asset.
 */
function construirSrcImagen(image: string): string {
  return new URL(`./img/${image}.jpg`, import.meta.url).href
}

/** Formatea un número como precio: 299 -> "$299.00" */
function formatearPrecio(precio: number): string {
  return `$${precio.toFixed(2)}`
}

/** Crea el elemento DOM de una tarjeta de guitarra. */
function crearTarjeta(guitarra: GuitarDTO): HTMLElement {
  const tarjeta = document.createElement('div')
  tarjeta.classList.add('guitarra')

  const imagen = document.createElement('img')
  imagen.src = construirSrcImagen(guitarra.image)
  imagen.alt = `Guitarra ${guitarra.name}`

  const info = document.createElement('div')
  info.classList.add('info-guitarra')

  const nombre = document.createElement('h3')
  nombre.textContent = guitarra.name

  const descripcion = document.createElement('p')
  descripcion.textContent = guitarra.description

  const precio = document.createElement('p')
  precio.classList.add('precio')
  precio.textContent = formatearPrecio(guitarra.price)

  const boton = document.createElement('button')
  boton.type = 'button'
  boton.classList.add('btn-agregar')
  boton.textContent = 'AGREGAR AL CARRITO'
  boton.dataset.id = String(guitarra.id)

  info.append(nombre, descripcion, precio, boton)
  tarjeta.append(imagen, info)

  return tarjeta
}

/**
 * Renderiza el catálogo completo dentro de #guitarras.
 * Limpia el contenedor y crea cada tarjeta con manipulación segura del DOM.
 */
function renderGuitarras(guitarras: GuitarDTO[]): void {
  const contenedor = document.querySelector<HTMLDivElement>('#guitarras')
  if (!contenedor) return

  contenedor.replaceChildren() // limpia el contenedor

  guitarras.forEach((guitarra) => {
    contenedor.appendChild(crearTarjeta(guitarra))
  })
}

/* ============================================================
   Carrito
   ============================================================ */

/* ---------- Vistas: leen el estado y pintan el DOM ---------- */

/**
 * Actualiza el contador visual del carrito en el header con la suma total
 * de cantidades de todos los ítems. El badge se oculta solo cuando el total
 * es 0 (regla CSS: .carrito__badge[data-cantidad="0"]).
 */
function actualizarHeader(): void {
  const badge = document.querySelector<HTMLSpanElement>('#carrito-cantidad')
  if (!badge) return

  const total = carrito.reduce((suma, item) => suma + item.cantidad, 0)
  badge.textContent = String(total)
  badge.dataset.cantidad = String(total)
}

/**
 * Suma (precio * cantidad) de todos los ítems y actualiza #total en pantalla.
 */
function calcularTotal(): void {
  const totalEl = document.querySelector<HTMLSpanElement>('#total')
  if (!totalEl) return

  const total = carrito.reduce(
    (suma, item) => suma + item.price * item.cantidad,
    0
  )
  totalEl.textContent = formatearPrecio(total)
}

/** Crea la fila DOM de un ítem del carrito. */
function crearFilaCarrito(item: CartItemDTO): HTMLElement {
  const fila = document.createElement('div')
  fila.classList.add('carrito-item')

  const imagen = document.createElement('img')
  imagen.src = construirSrcImagen(item.image)
  imagen.alt = `Guitarra ${item.name}`
  imagen.classList.add('carrito-item__img')

  // Columna central: nombre, precio unitario y controles de cantidad
  const info = document.createElement('div')
  info.classList.add('carrito-item__info')

  const nombre = document.createElement('span')
  nombre.classList.add('carrito-item__nombre')
  nombre.textContent = item.name

  const precio = document.createElement('span')
  precio.classList.add('carrito-item__precio')
  precio.textContent = `${formatearPrecio(item.price)} c/u`

  const controles = document.createElement('div')
  controles.classList.add('carrito-item__cantidad')

  const btnMenos = document.createElement('button')
  btnMenos.type = 'button'
  btnMenos.classList.add('carrito-item__btn-cant')
  btnMenos.textContent = '-'
  btnMenos.dataset.accion = 'decrementar'
  btnMenos.dataset.id = String(item.id)
  btnMenos.setAttribute('aria-label', `Quitar una ${item.name}`)

  const cantidad = document.createElement('span')
  cantidad.textContent = String(item.cantidad)

  const btnMas = document.createElement('button')
  btnMas.type = 'button'
  btnMas.classList.add('carrito-item__btn-cant')
  btnMas.textContent = '+'
  btnMas.dataset.accion = 'incrementar'
  btnMas.dataset.id = String(item.id)
  btnMas.setAttribute('aria-label', `Agregar una ${item.name}`)

  controles.append(btnMenos, cantidad, btnMas)
  info.append(nombre, precio, controles)

  // Columna derecha: subtotal + eliminar
  const derecha = document.createElement('div')
  derecha.classList.add('carrito-item__derecha')

  const subtotal = document.createElement('span')
  subtotal.classList.add('carrito-item__subtotal')
  subtotal.textContent = formatearPrecio(item.price * item.cantidad)

  const btnEliminar = document.createElement('button')
  btnEliminar.type = 'button'
  btnEliminar.classList.add('carrito-item__eliminar')
  btnEliminar.textContent = 'Eliminar'
  btnEliminar.dataset.accion = 'eliminar'
  btnEliminar.dataset.id = String(item.id)

  derecha.append(subtotal, btnEliminar)
  fila.append(imagen, info, derecha)

  return fila
}

/** Limpia y repinta la lista de ítems del carrito (o el mensaje de vacío). */
function renderCarrito(): void {
  const contenedor = document.querySelector<HTMLDivElement>('#carrito-items')
  if (!contenedor) return

  contenedor.replaceChildren()

  if (carrito.length === 0) {
    const vacio = document.createElement('p')
    vacio.classList.add('carrito-vacio')
    vacio.textContent = 'El carrito está vacío'
    contenedor.appendChild(vacio)
    return
  }

  carrito.forEach((item) => {
    contenedor.appendChild(crearFilaCarrito(item))
  })
}

/**
 * ÚNICO punto de sincronización. Cualquier mutación del estado del carrito
 * llama a esta función: repinta el panel, actualiza el contador del header
 * y recalcula el total, siempre en este mismo flujo. Así las tres vistas
 * jamás quedan desincronizadas del estado.
 */
function sincronizarCarrito(): void {
  renderCarrito()
  actualizarHeader()
  calcularTotal()
  localStorage.setItem('guitarla_carrito', JSON.stringify(carrito))
}

/* ---------- Visibilidad del Panel del Carrito ---------- */

/** Muestra el panel modal del carrito y el backdrop. */
function mostrarCarrito(): void {
  const panel = document.querySelector<HTMLElement>('#carrito-panel')
  const backdrop = document.querySelector<HTMLElement>('#carrito-backdrop')
  panel?.classList.add('mostrar')
  backdrop?.classList.add('mostrar')
}

/** Oculta el panel modal del carrito y el backdrop. */
function ocultarCarrito(): void {
  const panel = document.querySelector<HTMLElement>('#carrito-panel')
  const backdrop = document.querySelector<HTMLElement>('#carrito-backdrop')
  panel?.classList.remove('mostrar')
  backdrop?.classList.remove('mostrar')
}

/* ---------- Mutaciones: cambian el estado y sincronizan ---------- */

/**
 * Agrega una guitarra al carrito por su id. Si ya está, incrementa su cantidad;
 * si no, la agrega con cantidad 1. Despliega automáticamente el modal.
 */
function agregarCarrito(id: number): void {
  const guitarra = db.find((g) => g.id === id)
  if (!guitarra) return // id inexistente: no hacemos nada

  const existente = carrito.find((item) => item.id === id)
  if (existente) {
    existente.cantidad++
  } else {
    carrito.push({ ...guitarra, cantidad: 1 })
  }

  sincronizarCarrito()
  mostrarCarrito()
}

/** Incrementa en 1 la cantidad de un ítem. */
function incrementarCantidad(id: number): void {
  const item = carrito.find((i) => i.id === id)
  if (!item) return

  item.cantidad++
  sincronizarCarrito()
}

/** Decrementa en 1 la cantidad; si llega a 0, elimina el ítem del carrito. */
function decrementarCantidad(id: number): void {
  const item = carrito.find((i) => i.id === id)
  if (!item) return

  item.cantidad--
  if (item.cantidad === 0) {
    carrito = carrito.filter((i) => i.id !== id)
  }

  sincronizarCarrito()
}

/** Elimina un ítem del carrito sin importar su cantidad. */
function eliminarItem(id: number): void {
  carrito = carrito.filter((i) => i.id !== id)
  sincronizarCarrito()
}

/** Vacía por completo el carrito. */
function vaciarCarrito(): void {
  carrito = []
  sincronizarCarrito()
}

/* ---------- Eventos ---------- */

/**
 * Delegación en #guitarras: un único listener atiende el click de todos los
 * botones "AGREGAR AL CARRITO", presentes y futuros.
 */
function iniciarEventosCatalogo(): void {
  const contenedor = document.querySelector<HTMLDivElement>('#guitarras')
  if (!contenedor) return

  contenedor.addEventListener('click', (evento) => {
    const objetivo = evento.target as HTMLElement
    const boton = objetivo.closest<HTMLButtonElement>('.btn-agregar')
    if (!boton) return

    agregarCarrito(Number(boton.dataset.id))
  })
}

/**
 * Eventos del panel del carrito: abrir/cerrar, vaciar y —por delegación, ya
 * que las filas se regeneran— los botones +, - y eliminar de cada ítem.
 */
function iniciarEventosCarrito(): void {
  const panel = document.querySelector<HTMLElement>('#carrito-panel')

  document.querySelector('#abrir-carrito')?.addEventListener('click', () => {
    panel?.classList.contains('mostrar') ? ocultarCarrito() : mostrarCarrito()
  })
  document.querySelector('#cerrar-carrito')?.addEventListener('click', ocultarCarrito)
  document.querySelector('#carrito-backdrop')?.addEventListener('click', ocultarCarrito)
  document
    .querySelector('#vaciar-carrito')
    ?.addEventListener('click', vaciarCarrito)

  // Delegación sobre las filas dinámicas del carrito
  document.querySelector('#carrito-items')?.addEventListener('click', (evento) => {
    const objetivo = evento.target as HTMLElement
    const boton = objetivo.closest<HTMLButtonElement>('[data-accion]')
    if (!boton) return

    const id = Number(boton.dataset.id)
    switch (boton.dataset.accion) {
      case 'incrementar':
        incrementarCantidad(id)
        break
      case 'decrementar':
        decrementarCantidad(id)
        break
      case 'eliminar':
        eliminarItem(id)
        break
    }
  })
}

// El script es un módulo (deferred): el DOM ya está parseado al ejecutarse.
renderGuitarras(db)
iniciarEventosCatalogo()
iniciarEventosCarrito()
sincronizarCarrito() // estado inicial: panel vacío, total $0.00, badge oculto
