import { PageData } from "../entities/Paginacion";
import {
  ActualizarProductoData,
  CrearProductoData,
  FiltrosProductos,
  Producto,
} from "../entities/Producto";

export interface ProductoRepository {
  findMany(filtros: FiltrosProductos): Promise<PageData<Producto>>;
  findById(id: number): Promise<Producto | null>;
  create(data: CrearProductoData): Promise<Producto>;
  update(id: number, data: ActualizarProductoData): Promise<Producto>;
  delete(id: number): Promise<void>;
}
