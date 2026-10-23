import { Request, Response } from "express";
import { PedidosService } from "../../../application/services/PedidosService";
import { UnauthorizedError } from "../../../domain/errors/AppError";
import { paginacionSchema } from "../schemas/comunes";
import { crearPedidoSchema } from "../schemas/pedidos.schemas";
import { parse } from "../validation/parse";

export class PedidosController {
  constructor(private readonly pedidos: PedidosService) {}

  crear = async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError();
    const data = parse(crearPedidoSchema, req.body);
    // El dueño del pedido es el usuario del TOKEN, nunca uno que venga en el body
    const pedido = await this.pedidos.crear({ ...data, userId: req.user.id });
    res.status(201).json(pedido);
  };

  mias = async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError();
    const { page, limit } = parse(paginacionSchema, req.query);
    const resultado = await this.pedidos.misPedidos(req.user.id, page, limit);
    res.json(resultado);
  };

  todos = async (req: Request, res: Response) => {
    const { page, limit } = parse(paginacionSchema, req.query);
    const resultado = await this.pedidos.todos(page, limit);
    res.json(resultado);
  };
}
