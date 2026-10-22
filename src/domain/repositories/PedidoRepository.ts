import { PageData } from "../entities/Paginacion";
import { CrearPedidoData, PedidoDetalle } from "../entities/Pedido";

export interface PedidoRepository {
  create(data: CrearPedidoData): Promise<PedidoDetalle>;
  findByUser(userId: number, page: number, limit: number): Promise<PageData<PedidoDetalle>>;
  findAll(page: number, limit: number): Promise<PageData<PedidoDetalle>>;
}
