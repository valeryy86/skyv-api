export type Categoria = "maquillaje" | "capilar";

export interface Producto {
  id: number;
  nombre: string;
  marca: string;
  categoria: Categoria;
  precio: number;
  imagen: string;
  descripcion: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrearProductoData {
  nombre: string;
  marca: string;
  categoria: Categoria;
  precio: number;
  imagen: string;
  descripcion?: string | null;
}

export type ActualizarProductoData = Partial<CrearProductoData>;

export interface FiltrosProductos {
  page: number;
  limit: number;
  marca?: string;
  categoria?: Categoria;
  q?: string;
  minPrecio?: number;
  maxPrecio?: number;
}
