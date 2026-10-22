export type TipoCliente = "Cliente" | "Revendedor";
export type EstadoPedido = "pendiente" | "confirmado" | "cancelado";

export interface Pedido {
  id: number;
  cantidad: number;
  telefono: string;
  tipoCliente: TipoCliente;
  mensaje: string | null;
  estado: EstadoPedido;
  createdAt: Date;
  userId: number;
  productoId: number;
}

// Pedido con la información del producto y del usuario para mostrar en pantalla
export interface PedidoDetalle extends Pedido {
  producto: { id: number; nombre: string; marca: string; precio: number; imagen: string };
  user: { id: number; nombre: string; email: string };
}

export interface CrearPedidoData {
  userId: number; // SIEMPRE sale del token, nunca del body
  productoId: number;
  cantidad: number;
  telefono: string;
  tipoCliente: TipoCliente;
  mensaje?: string | null;
}
