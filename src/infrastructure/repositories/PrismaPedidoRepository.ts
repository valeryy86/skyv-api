import { Prisma } from "@prisma/client";
import { PageData } from "../../domain/entities/Paginacion";
import { CrearPedidoData, PedidoDetalle } from "../../domain/entities/Pedido";
import { PedidoRepository } from "../../domain/repositories/PedidoRepository";
import { prisma } from "../prisma/client";

// Qué datos del producto y del usuario se traen junto con cada pedido
// (del usuario NUNCA se trae la contraseña)
const incluir = {
  producto: { select: { id: true, nombre: true, marca: true, precio: true, imagen: true } },
  user: { select: { id: true, nombre: true, email: true } },
} satisfies Prisma.PedidoInclude;

export class PrismaPedidoRepository implements PedidoRepository {
  create(data: CrearPedidoData): Promise<PedidoDetalle> {
    return prisma.pedido.create({ data, include: incluir });
  }

  async findByUser(userId: number, page: number, limit: number): Promise<PageData<PedidoDetalle>> {
    const where = { userId };
    const [data, total] = await prisma.$transaction([
      prisma.pedido.findMany({
        where,
        include: incluir,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.pedido.count({ where }),
    ]);
    return { data, total };
  }

  async findAll(page: number, limit: number): Promise<PageData<PedidoDetalle>> {
    const [data, total] = await prisma.$transaction([
      prisma.pedido.findMany({
        include: incluir,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.pedido.count(),
    ]);
    return { data, total };
  }
}
