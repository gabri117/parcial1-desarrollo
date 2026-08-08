# GuitarLA

Tienda de guitarras construida con **Vite + TypeScript** (template `vanilla-ts`).

## Requisitos

- Node.js 18 o superior
- npm

## Instalación

```bash
npm install
```

## Ejecución en desarrollo

```bash
npm run dev
```

Vite levanta un servidor local (por defecto en `http://localhost:5173`).

## Build de producción

```bash
npm run build
```

Genera la versión optimizada en la carpeta `dist/`.

## Previsualizar el build

```bash
npm run preview
```

## Estructura del proyecto

```
.
├── index.html
├── src/
│   ├── main.ts               # Punto de entrada
│   ├── styles.css            # Estilos globales
│   ├── data/
│   │   └── db.ts             # Arreglo de guitarras (GuitarDTO[])
│   ├── dtos/
│   │   └── guitar.dto.ts     # Interface GuitarDTO
│   └── img/                  # Imágenes (guitarra_01.jpg … guitarra_12.jpg, logo, etc.)
├── .gitignore
├── package.json
└── tsconfig.json
```

## Notas

- En `db.ts`, la propiedad `image` guarda **solo el nombre** del archivo sin extensión
  (ej. `guitarra_01`). Al construir el `src` de cada imagen hay que concatenar `.jpg`.
