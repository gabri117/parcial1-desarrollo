# GuitarLA

Aplicación web frontend para la tienda de guitarras **GuitarLA**, desarrollada con TypeScript, Vanilla CSS y Vite. Permite explorar un catálogo dinámico de guitarras clásicas y gestionar un carrito de compras completo en tiempo real.

---

## 🚀 Tecnologías Utilizadas

- **Lenguaje:** TypeScript / Vanilla JS
- **Estilos:** CSS3 / Vanilla CSS (Variables CSS, CSS Grid responsivo, Flexbox)
- **Maquetación:** HTML5 Semántico (Accesibilidad WCAG 2.1)
- **Bundler / Dev Server:** Vite (`vanilla-ts`)

---

## 🛠️ Requisitos e Instalación

### Pre-requisitos
- [Node.js](https://nodejs.org/) v18.0.0 o superior
- npm v9.0.0 o superior

### Instalación
Clona el repositorio e instala las dependencias necesarias:

```bash
git clone <URL_DEL_REPOSISTORIO>
cd parcial1-desarrollo
npm install
```

### Ejecución en Desarrollo
Para iniciar el servidor de desarrollo local de Vite:

```bash
npm run dev
```

Abre tu navegador en `http://localhost:5173`.

---

## 📁 Estructura del Proyecto

```text
parcial1-desarrollo/
├── index.html
├── package.json
├── tsconfig.json
├── .gitignore
├── README.md
└── src/
    ├── main.ts                 # Lógica principal de la app y estado del carrito
    ├── styles.css              # Sistema de diseño, grid responsivo y animaciones
    ├── data/
    │   └── db.ts               # Catálogo de productos (GuitarDTO[])
    ├── dtos/
    │   ├── guitar.dto.ts       # Interface GuitarDTO
    │   └── cart-item.dto.ts    # Interface CartItemDTO
    └── img/                    # Assets gráficos (guitarras, logo, carrito)
```

---

## ✨ Características Principales

- **Renderizado Dinámico del Catálogo:** Carga segura del DOM desde el conjunto de datos `db.ts`.
- **Diseño Responsivo:** CSS Grid adaptativo (1 col en móvil, 2 en tablet, 3-4 en escritorio).
- **Carrito Flotante / Modal Interactivo:**
  - Apertura automática al hacer clic en *"AGREGAR AL CARRITO"*.
  - Controles de incremento (`+`) y decremento (`-`) con eliminación automática al llegar a 0.
  - Botón de eliminación por producto y opción de *"VACIAR CARRITO"*.
  - Cálculo del total a pagar en tiempo real a 2 decimales (`$XXX.XX`).
- **Persistencia en LocalStorage:** El carrito se conserva al recargar la página.
- **Accesibilidad:** Soporte completo para navegación por teclado (`:focus-visible` en todos los controles).
