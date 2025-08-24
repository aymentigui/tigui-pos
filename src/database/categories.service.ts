import { initDB } from "./connection";

// Création d'une catégorie
export const createCategory = async (nom: string, parentId: number | null = null) => {
  const db = await initDB();
  const query = `INSERT INTO categories (nom, parent_id) VALUES (?, ?)`;
  const result = await db.run(query, [nom, parentId]);
  return result.lastID;
};

// Récupérer une catégorie par ID
export const getCategoryById = async (id: number) => {
  const db = await initDB();
  const query = `SELECT * FROM categories WHERE id = ?`;
  const result = await db.get(query, [id]);
  return result;
};

// Récupérer toutes les catégories
export const getAllCategories = async () => {
  const db = await initDB();
  const query = `SELECT * FROM categories`;
  const result = await db.all(query);
  return result;
};

// Mettre à jour une catégorie
export const updateCategory = async (id: number, nom: string, parentId: number | null = null) => {
  const db = await initDB();
  const query = `UPDATE categories SET nom = ?, parent_id = ? WHERE id = ?`;
  const result = await db.run(query, [nom, parentId, id]);
  return result.changes > 0;
};

// Supprimer une catégorie
export const deleteCategory = async (id: number) => {
  const db = await initDB();
  const query = `DELETE FROM categories WHERE id = ?`;
  const result = await db.run(query, [id]);
  return result.changes > 0;
};
