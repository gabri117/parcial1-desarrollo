import type { GuitarDTO } from './guitar.dto'

/**
 * Un ítem del carrito es una guitarra con la cantidad seleccionada.
 * Extiende GuitarDTO para reutilizar todos sus campos sin duplicarlos.
 */
export interface CartItemDTO extends GuitarDTO {
  cantidad: number
}
