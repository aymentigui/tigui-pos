import jwt from "jsonwebtoken";
import { JWT_SECRET, ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from "./security";

type JwtPayload = { uid: number; role: string; perms: string[] };

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

export const signRefreshToken = (payload: Pick<JwtPayload, "uid"> & { tokenId: string }) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_TTL });

export const verifyToken = <T = any>(token: string) =>
  jwt.verify(token, JWT_SECRET) as T;