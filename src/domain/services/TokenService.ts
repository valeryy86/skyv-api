import { Role } from "../entities/User";

// Lo ÚNICO que viaja dentro del JWT: el id y el rol.
// Nada de contraseñas ni correos: el payload se puede leer sin la clave.
export interface TokenPayload {
  id: number;
  role: Role;
}

export interface TokenService {
  sign(payload: TokenPayload): string;
  verify(token: string): TokenPayload; // lanza un error si el token es inválido o expiró
}
