import { ConflictError, NotFoundError } from "../../domain/errors/AppError";
import { PaginatedResult } from "../../domain/entities/Paginacion";
import {
  ActualizarProductoData,
  CrearProductoData,
  FiltrosProductos,
  Producto,
} from "../../domain/entities/Producto";
import { ProductoRepository } from "../../domain/repositories/ProductoRepository";
import { paginar } from "../utils/paginar";

export class ProductosService {
  constructor(private readonly productos: ProductoRepository) {}

  async listar(filtros: FiltrosProductos): Promise<PaginatedResult<Producto>> {
    const resultado = await this.productos.findMany(filtros);
    return paginar(resultado, filtros.page, filtros.limit);
  }

  async obtener(id: number): Promise<Producto> {
    const producto = await this.productos.findById(id);
    if (!producto) {
      throw new NotFoundError("Producto no encontrado");
    }
    return producto;
  }

  crear(data: CrearProductoData): Promise<Producto> {
    return this.productos.create(data);
  }

  async actualizar(id: number, data: ActualizarProductoData): Promise<Producto> {
    await this.obtener(id); // lanza 404 si no existe
    return this.productos.update(id, data);
  }

    async eliminar(id: number): Promise<void> {
    await this.obtener(id); 
    if (await this.productos.tienePedidos(id)) {
      throw new ConflictError("No se puede eliminar este producto porque ya tiene pedidos.");
    }
    await this.productos.delete(id);
  }
}
