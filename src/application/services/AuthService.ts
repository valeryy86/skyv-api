import { ConflictError, UnauthorizedError } from "../../domain/errors/AppError";
import { PublicUser, User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { PasswordHasher } from "../../domain/services/PasswordHasher";
import { TokenService } from "../../domain/services/TokenService";

export interface RegisterInput {
  nombre: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: PublicUser;
}

// Quita la contraseña antes de devolver el usuario
export function toPublicUser(user: User): PublicUser {
  const { password: _password, ...publico } = user;
  return publico;
}

export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  async register(input: RegisterInput): Promise<AuthResult> {
    const existente = await this.users.findByEmail(input.email);
    if (existente) {
      throw new ConflictError("El correo ya está registrado", {
        email: "Este correo ya está registrado",
      });
    }

    const hash = await this.hasher.hash(input.password);
    const user = await this.users.create({
      nombre: input.nombre,
      email: input.email,
      password: hash,
      role: "user", // nadie se puede registrar como admin
    });

    const token = this.tokens.sign({ id: user.id, role: user.role });
    return { token, user: toPublicUser(user) };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await this.users.findByEmail(input.email);
    // Mismo mensaje si falla el correo o la contraseña: así no se revela cuál falló
    const valido = user ? await this.hasher.compare(input.password, user.password) : false;
    if (!user || !valido) {
      throw new UnauthorizedError("Correo o contraseña incorrectos");
    }

    const token = this.tokens.sign({ id: user.id, role: user.role });
    return { token, user: toPublicUser(user) };
  }

  async me(userId: number): Promise<PublicUser> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedError("La sesión ya no es válida");
    }
    return toPublicUser(user);
  }
}
