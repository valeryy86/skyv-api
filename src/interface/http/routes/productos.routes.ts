import { RequestHandler, Router } from "express";
import { ProductosController } from "../controllers/ProductosController";
import { soloAdmin } from "../middlewares/requireRole";

export function productosRoutes(controller: ProductosController, auth: RequestHandler): Router {
  const router = Router();
  // Públicas
  router.get("/", controller.listar);
  router.get("/:id", controller.obtener);
  // Solo admin: primero se verifica el token (401) y luego el rol (403)
  router.post("/", auth, soloAdmin, controller.crear);
  router.put("/:id", auth, soloAdmin, controller.actualizar);
  router.delete("/:id", auth, soloAdmin, controller.eliminar);
  return router;
}
