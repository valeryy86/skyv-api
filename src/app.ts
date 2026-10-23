import cors from "cors";
import express from "express";
import { AuthService } from "./application/services/AuthService";
import { PedidosService } from "./application/services/PedidosService";
import { ProductosService } from "./application/services/ProductosService";
import { env } from "./infrastructure/config/env";
import { PrismaPedidoRepository } from "./infrastructure/repositories/PrismaPedidoRepository";
import { PrismaProductoRepository } from "./infrastructure/repositories/PrismaProductoRepository";
import { PrismaUserRepository } from "./infrastructure/repositories/PrismaUserRepository";
import { BcryptPasswordHasher } from "./infrastructure/security/BcryptPasswordHasher";
import { JwtTokenService } from "./infrastructure/security/JwtTokenService";
import { AuthController } from "./interface/http/controllers/AuthController";
import { PedidosController } from "./interface/http/controllers/PedidosController";
import { ProductosController } from "./interface/http/controllers/ProductosController";
import { authenticate } from "./interface/http/middlewares/authenticate";
import { errorHandler, notFoundHandler } from "./interface/http/middlewares/errorHandler";
import { authRoutes } from "./interface/http/routes/auth.routes";
import { pedidosRoutes } from "./interface/http/routes/pedidos.routes";
import { productosRoutes } from "./interface/http/routes/productos.routes";

export function createApp() {
  // 1. Infraestructura (implementaciones concretas)
  const userRepo = new PrismaUserRepository();
  const productoRepo = new PrismaProductoRepository();
  const pedidoRepo = new PrismaPedidoRepository();
  const hasher = new BcryptPasswordHasher();
  const tokens = new JwtTokenService(env.JWT_SECRET, env.JWT_EXPIRES_IN);

  // 2. Aplicación (casos de uso)
  const authService = new AuthService(userRepo, hasher, tokens);
  const productosService = new ProductosService(productoRepo);
  const pedidosService = new PedidosService(pedidoRepo, productoRepo);

  // 3. Interfaz (controladores y middlewares)
  const auth = authenticate(tokens);
  const authController = new AuthController(authService);
  const productosController = new ProductosController(productosService);
  const pedidosController = new PedidosController(pedidosService);

  const app = express();

  // CORS: solo el frontend (localhost y Vercel) puede llamar a la API. Nada de "*"
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes(authController, auth));
  app.use("/api/productos", productosRoutes(productosController, auth));
  app.use("/api/pedidos", pedidosRoutes(pedidosController, auth));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
