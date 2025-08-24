import { initDB } from "./connection";

// Créer une marque
export const createBrand = async (nom: string) => {
  const db = await initDB();
  const query = `INSERT INTO brands (nom) VALUES (?)`;
  const result = await db.run(query, [nom]);
  return result.lastID;
};

// Récupérer une marque par ID
export const getBrandById = async (id: number) => {
  const db = await initDB();
  const query = `SELECT * FROM brands WHERE id = ?`;
  const result = await db.get(query, [id]);
  return result;
};

// Récupérer toutes les marques
export const getAllBrands = async () => {
  const db = await initDB();
  const query = `SELECT * FROM brands`;
  const result = await db.all(query);
  return result;
};

// Mettre à jour une marque
export const updateBrand = async (id: number, nom: string) => {
  const db = await initDB();
  const query = `UPDATE brands SET nom = ? WHERE id = ?`;
  const result = await db.run(query, [nom, id]);
  return result.changes > 0;
};

// Supprimer une marque
export const deleteBrand = async (id: number) => {
  const db = await initDB();
  const query = `DELETE FROM brands WHERE id = ?`;
  const result = await db.run(query, [id]);
  return result.changes > 0;
};
