// src/main/auth.service.ts
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { signAccessToken, signRefreshToken, verifyToken } from "../lib/jwt";
import { addDays } from "./date-utils";

const dbp = (async () => open({ filename: "database.sqlite", driver: sqlite3.Database }))();

async function getUserByUsername(username: string) {
  const db = await dbp;
  return db.get("SELECT * FROM users WHERE username = ?", username);
}
async function getUserPerms(userId: number): Promise<string[]> {
  const db = await dbp;
  const rows = await db.all(
    `SELECT p.name as permission
     FROM users u
     JOIN roles r ON r.id = u.role_id
     JOIN role_permissions rp ON rp.role_id = r.id
     JOIN permissions p ON p.id = rp.permission_id
     WHERE u.id = ?`, userId
  );
  return rows.map(r => r.permission);
}
async function getUserRoleName(userId: number): Promise<string> {
  const db = await dbp;
  const row = await db.get(
    `SELECT r.name as role FROM users u JOIN roles r ON r.id = u.role_id WHERE u.id = ?`,
    userId
  );
  return row?.role || "user";
}

export async function login(username: string, password: string) {
  const db = await dbp;
  const user = await getUserByUsername(username);
  if (!user) return { ok: false, error: "Utilisateur introuvable" };
  const match = await bcrypt.compare(password, user.password);
  if (!match) return { ok: false, error: "Mot de passe incorrect" };

  const perms = await getUserPerms(user.id);
  const role = await getUserRoleName(user.id);

  const access = signAccessToken({ uid: user.id, role, perms });
  const tokenId = randomUUID();
  const refresh = signRefreshToken({ uid: user.id, tokenId });

  // persister le refresh pour rotation/revocation
  const now = Date.now();
  await db.run(
    `INSERT INTO refresh_tokens(id, user_id, token, created_at, expires_at, revoked)
     VALUES (?, ?, ?, ?, ?, 0)`,
    tokenId, user.id, refresh, now, addDays(now, 30)
  );

  return { ok: true, access, refresh, user: { id: user.id, username: user.username, role, perms } };
}

export async function refreshTokens(refreshToken: string) {
  const db = await dbp;

  // 1) vérifier signature
  let payload: any;
  try { payload = verifyToken(refreshToken); } 
  catch { return { ok: false, error: "Refresh invalide" }; }

  const { uid, tokenId } = payload || {};
  if (!uid || !tokenId) return { ok: false, error: "Refresh payload invalide" };

  // 2) vérifier persistence & non-révocation
  const row = await db.get(
    `SELECT * FROM refresh_tokens WHERE id = ? AND user_id = ?`, tokenId, uid
  );
  if (!row || row.revoked) return { ok: false, error: "Refresh révoqué" };
  if (row.expires_at < Date.now()) return { ok: false, error: "Refresh expiré" };

  // 3) rotation: révoque l’ancien et émet un nouveau
  await db.run(`UPDATE refresh_tokens SET revoked = 1 WHERE id = ?`, tokenId);

  const role = await getUserRoleName(uid);
  const perms = await getUserPerms(uid);

  const newAccess = signAccessToken({ uid, role, perms });

  const newTokenId = randomUUID();
  const newRefresh = signRefreshToken({ uid, tokenId: newTokenId });
  await db.run(
    `INSERT INTO refresh_tokens(id, user_id, token, created_at, expires_at, revoked)
     VALUES (?, ?, ?, ?, ?, 0)`,
    newTokenId, uid, newRefresh, Date.now(), addDays(Date.now(), 30)
  );

  return { ok: true, access: newAccess, refresh: newRefresh };
}

export async function logout(refreshToken: string) {
  // révoquer le refresh
  try {
    const { tokenId } = verifyToken(refreshToken) as any;
    const db = await dbp;
    await db.run(`UPDATE refresh_tokens SET revoked = 1 WHERE id = ?`, tokenId);
  } catch {
    /* token déjà invalide, pas grave */
  }
  return { ok: true };
}
