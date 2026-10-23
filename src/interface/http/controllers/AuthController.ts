import { Request, Response } from "express";
import { AuthService } from "../../../application/services/AuthService";
import { UnauthorizedError } from "../../../domain/errors/AppError";
import { loginSchema, registerSchema } from "../schemas/auth.schemas";
import { parse } from "../validation/parse";

// Los controladores solo: 1) validan la entrada, 2) llaman al servicio, 3) responden
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  register = async (req: Request, res: Response) => {
    const data = parse(registerSchema, req.body);
    const resultado = await this.auth.register(data);
    res.status(201).json(resultado);
  };

  login = async (req: Request, res: Response) => {
    const data = parse(loginSchema, req.body);
    const resultado = await this.auth.login(data);
    res.json(resultado);
  };

  me = async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError();
    const user = await this.auth.me(req.user.id);
    res.json(user);
  };
}
