import { NotFoundError } from "../../domain/errors/AppError";
import { PaginatedResult } from "../../domain/entities/Paginacion";
import { CrearPedidoData, PedidoDetalle } from "../../domain/entities/Pedido";
import { PedidoRepository } from "../../domain/repositories/PedidoRepository";
import { ProductoRepository } from "../../domain/repositories/ProductoRepository";
import { paginar } from "../utils/paginar";

export class PedidosService {
  constructor(
    private readonly pedidos: PedidoRepository,
    private readonly productos: ProductoRepository,
  ) {}

  async crear(data: CrearPedidoData): Promise<PedidoDetalle> {
    const producto = await this.productos.findById(data.productoId);
    if (!producto) {
      throw new NotFoundError("El producto que intentas pedir no existe");
    }
    return this.pedidos.create(data);
  }

  async misPedidos(userId: number, page: number, limit: number): Promise<PaginatedResult<PedidoDetalle>> {
    const resultado = await this.pedidos.findByUser(userId, page, limit);
    return paginar(resultado, page, limit);
  }

  async todos(page: number, limit: number): Promise<PaginatedResult<PedidoDetalle>> {
    const resultado = await this.pedidos.findAll(page, limit);
    return paginar(resultado, page, limit);
  }
}
