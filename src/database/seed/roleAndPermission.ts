import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";
import { initDB0 } from "../connection";

// Ouvre la connexion
export const openDB = async () => {
  return open({
    filename: "database.sqlite",
    driver: sqlite3.Database,
  });
};

export const seedDB = async () => {
  const db = await  initDB0()

  // ====== ROLES ======
  const roles = ["admin", "caissier", "gestionnaire", "boutique"];
  for (const role of roles) {
    await db.run(`INSERT OR IGNORE INTO roles (name) VALUES (?)`, [role]);
  }

  // ====== PERMISSIONS ======
  const permissions = [
    // ضرائب
    "ضرائب.اضافة",
    "ضرائب.تعديل",
    "ضرائب.حذف",
    "ضرائب.عرض",
    // منتجات
    "منتجات.اضافة",
    "منتجات.تعديل",
    "منتجات.حذف",
    "منتجات.عرض",
    // ماركات
    "ماركات.اضافة",
    "ماركات.تعديل",
    "ماركات.حذف",
    "ماركات.عرض",
    // الوان
    "الوان.اضافة",
    "الوان.تعديل",
    "الوان.حذف",
    "الوان.عرض",
    // فئات
    "فئات.اضافة",
    "فئات.تعديل",
    "فئات.حذف",
    "فئات.عرض",
    // انواع (attributs)
    "انواع.اضافة",
    "انواع.تعديل",
    "انواع.حذف",
    "انواع.عرض",
  ];

  for (const perm of permissions) {
    await db.run(`INSERT OR IGNORE INTO permissions (name) VALUES (?)`, [perm]);
  }

  // ====== ASSIGNER TOUTES LES PERMISSIONS AU ROLE ADMIN ======
  const adminRole = await db.get(`SELECT id FROM roles WHERE name = ?`, ["admin"]);
  const allPerms = await db.all(`SELECT id FROM permissions`);
  for (const p of allPerms) {
    await db.run(
      `INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)`,
      [adminRole.id, p.id]
    );
  }

  // ====== CREER USER ADMIN ======
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await db.run(
    `INSERT OR IGNORE INTO users (nom, prenom, username, email, password, is_admin, role_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ["Admin", "Super", "admin", "admin@example.com", hashedPassword, 1, adminRole.id]
  );

  console.log("✅ Seeder exécuté avec succès !");
};
