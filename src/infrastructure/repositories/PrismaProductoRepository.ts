import { Prisma } from "@prisma/client";
import { PageData } from "../../domain/entities/Paginacion";
import {
  ActualizarProductoData,
  CrearProductoData,
  FiltrosProductos,
  Producto,
} from "../../domain/entities/Producto";
import { ProductoRepository } from "../../domain/repositories/ProductoRepository";
import { prisma } from "../prisma/client";

export class PrismaProductoRepository implements ProductoRepository {
  async findMany(filtros: FiltrosProductos): Promise<PageData<Producto>> {
    const { page, limit, marca, categoria, q, minPrecio, maxPrecio } = filtros;

    // Los filtros se combinan: solo se agregan los que vienen en la URL
    const where: Prisma.ProductoWhereInput = {};
    if (marca) where.marca = { equals: marca, mode: "insensitive" };
    if (categoria) where.categoria = categoria;
    if (q) where.nombre = { contains: q, mode: "insensitive" };
    if (minPrecio !== undefined || maxPrecio !== undefined) {
      where.precio = { gte: minPrecio, lte: maxPrecio };
    }

    const [data, total] = await prisma.$transaction([
      prisma.producto.findMany({
        where,
        orderBy: { id: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.producto.count({ where }),
    ]);

    return { data, total };
  }

  findById(id: number): Promise<Producto | null> {
    return prisma.producto.findUnique({ where: { id } });
  }

  create(data: CrearProductoData): Promise<Producto> {
    return prisma.producto.create({ data });
  }

  update(id: number, data: ActualizarProductoData): Promise<Producto> {
    return prisma.producto.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await prisma.producto.delete({ where: { id } });
  }
    async tienePedidos(id: number): Promise<boolean> {
    const cantidad = await prisma.pedido.count({ where: { productoId: id } });
    return cantidad > 0;
  }
}
