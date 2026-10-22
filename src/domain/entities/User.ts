export type Role = "admin" | "user";

export interface User {
  id: number;
  nombre: string;
  email: string;
  password: string; // siempre el hash, nunca la contraseña real
  role: Role;
  createdAt: Date;
}

// Lo que sí se puede devolver al cliente: el usuario SIN la contraseña
export type PublicUser = Omit<User, "password">;

export interface CrearUserData {
  nombre: string;
  email: string;
  password: string;
  role?: Role;
}
