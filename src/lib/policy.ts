// src/main/policy.ts
import { verifyToken } from "./jwt";

export type AuthContext = {
  uid: number;
  role: string;
  perms: string[];
};

export const withAuth = (guard: (ctx: AuthContext) => void, handler: (e: any, ctx: AuthContext, ...args: any[]) => Promise<any>) =>
  async (event: any, token: string, ...args: any[]) => {
    try {
      const payload = verifyToken<AuthContext>(token);
      const ctx: AuthContext = { uid: payload.uid, role: payload.role, perms: payload.perms };
      guard(ctx);
      return await handler(event, ctx, ...args);
    } catch (e: any) {
      return { ok: false, error: "UNAUTHORIZED" };
    }
  };

export const requireRole = (role: string) => (ctx: AuthContext) => {
  if (ctx.role !== role) throw new Error("FORBIDDEN");
};

export const requirePerm = (perm: string) => (ctx: AuthContext) => {
  if (!ctx.perms?.includes(perm)) throw new Error("FORBIDDEN");
};
