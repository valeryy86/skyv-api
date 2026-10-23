import { Request, Response } from "express";
import { ProductosService } from "../../../application/services/ProductosService";
import { idParamSchema } from "../schemas/comunes";
import {
  actualizarProductoSchema,
  crearProductoSchema,
  listarProductosSchema,
} from "../schemas/productos.schemas";
import { parse } from "../validation/parse";

export class ProductosController {
  constructor(private readonly productos: ProductosService) {}

  listar = async (req: Request, res: Response) => {
    const filtros = parse(listarProductosSchema, req.query);
    const resultado = await this.productos.listar(filtros);
    res.json(resultado);
  };

  obtener = async (req: Request, res: Response) => {
    const { id } = parse(idParamSchema, req.params);
    const producto = await this.productos.obtener(id);
    res.json(producto);
  };

  crear = async (req: Request, res: Response) => {
    const data = parse(crearProductoSchema, req.body);
    const producto = await this.productos.crear(data);
    res.status(201).json(producto);
  };

  actualizar = async (req: Request, res: Response) => {
    const { id } = parse(idParamSchema, req.params);
    const data = parse(actualizarProductoSchema, req.body);
    const producto = await this.productos.actualizar(id, data);
    res.json(producto);
  };

  eliminar = async (req: Request, res: Response) => {
    const { id } = parse(idParamSchema, req.params);
    await this.productos.eliminar(id);
    res.status(204).send();
  };
}
