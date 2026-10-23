import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { Role } from "../../domain/entities/User";
import { TokenPayload, TokenService } from "../../domain/services/TokenService";

export class JwtTokenService implements TokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string,
  ) {}

  sign(payload: TokenPayload): string {
    return jwt.sign({ id: payload.id, role: payload.role }, this.secret, {
      expiresIn: this.expiresIn as SignOptions["expiresIn"],
    });
  }

  verify(token: string): TokenPayload {
    // jwt.verify lanza un error si la firma no coincide o si el token expiró
    const decoded = jwt.verify(token, this.secret);
    if (typeof decoded === "string") {
      throw new Error("Token con formato inválido");
    }
    const { id, role } = decoded as JwtPayload & { id?: unknown; role?: unknown };
    if (typeof id !== "number" || (role !== "admin" && role !== "user")) {
      throw new Error("Token con formato inválido");
    }
    return { id, role: role as Role };
  }
}
