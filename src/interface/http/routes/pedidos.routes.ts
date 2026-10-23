import { RequestHandler, Router } from "express";
import { PedidosController } from "../controllers/PedidosController";
import { soloAdmin } from "../middlewares/requireRole";

export function pedidosRoutes(controller: PedidosController, auth: RequestHandler): Router {
  const router = Router();
  router.post("/", auth, controller.crear); // usuario autenticado
  router.get("/mias", auth, controller.mias); // usuario autenticado: solo los suyos
  router.get("/", auth, soloAdmin, controller.todos); // solo admin: todos
  return router;
}
