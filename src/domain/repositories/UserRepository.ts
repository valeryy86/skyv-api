import { CrearUserData, User } from "../entities/User";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(data: CrearUserData): Promise<User>;
}
