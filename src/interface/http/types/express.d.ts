import { TokenPayload } from "../../../domain/services/TokenService";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export {};
