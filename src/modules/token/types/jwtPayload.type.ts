import { UserRole } from "./role.type";

export type JwtPayload = {
  email: string;
  sub: number;
  role: UserRole
};
