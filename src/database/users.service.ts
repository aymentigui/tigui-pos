import { initDB } from "./connection";

// ===============================
// CREATE USER
// ===============================
export const createUser = async (
  nom: string,
  prenom: string,
  username: string,
  email: string,
  password: string,
  tel1: string,
  tel2: string,
  role: string,
  is_admin: number = 0
) => {
  const db = await initDB();
  const result = await db.run(
    `INSERT INTO users (nom, prenom, username, email, password, tel1, tel2, role, is_admin)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nom, prenom, username, email, password, tel1, tel2, role, is_admin]
  );
  return result.lastID;
};

// ===============================
// GET USER BY ID
// ===============================
export const getUserById = async (id: number) => {
  const db = await initDB();
  const result = await db.get(
    `SELECT * FROM users WHERE id = ?`,
    [id]
  );
  return result;
};

// ===============================
// GET ALL USERS
// ===============================
export const getAllUsers = async () => {
  const db = await initDB();
  const result = await db.all(`SELECT * FROM users`);
  return result;
};

// ===============================
// UPDATE USER
// ===============================
export const updateUser = async (
  id: number,
  nom: string,
  prenom: string,
  username: string,
  email: string,
  password: string,
  tel1: string,
  tel2: string,
  role: string,
  is_admin: number
) => {
  const db = await initDB();
  const result = await db.run(
    `UPDATE users
     SET nom = ?, prenom = ?, username = ?, email = ?, password = ?, tel1 = ?, tel2 = ?, role = ?, is_admin = ?
     WHERE id = ?`,
    [nom, prenom, username, email, password, tel1, tel2, role, is_admin, id]
  );
  return result.changes > 0;
};

// ===============================
// DELETE USER
// ===============================
export const deleteUser = async (id: number) => {
  const db = await initDB();
  const result = await db.run(
    `DELETE FROM users WHERE id = ?`,
    [id]
  );
  return result.changes > 0;
};

// ===============================
// GET USER BY USERNAME
// ===============================
export const getUserByUsername = async (username: string) => {
  const db = await initDB();
  const result = await db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username]
  );
  return result;
};

// ===============================
// GET USER BY EMAIL
// ===============================
export const getUserByEmail = async (email: string) => {
  const db = await initDB();
  const result = await db.get(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );
  return result;
};
