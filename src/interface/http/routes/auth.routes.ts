import { RequestHandler, Router } from "express";
import { AuthController } from "../controllers/AuthController";

export function authRoutes(controller: AuthController, auth: RequestHandler): Router {
  const router = Router();
  router.post("/register", controller.register); // público
  router.post("/login", controller.login); // público
  router.get("/me", auth, controller.me); // requiere token
  return router;
}
