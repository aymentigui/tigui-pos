import { initDB } from "../connection";

// =====================
// ATTRIBUTS
// =====================

// Créer un attribut
export const createAttribut = async (nom: string) => {
  const db = await initDB();
  const query = `INSERT INTO attributs (nom) VALUES (?)`;
  const result = await db.run(query, [nom]);
  return result.lastID;
};

// Récupérer un attribut
export const getAttributById = async (id: number) => {
  const db = await initDB();
  const query = `SELECT * FROM attributs WHERE id = ?`;
  return db.get(query, [id]);
};

// Récupérer tous les attributs
export const getAllAttributs = async () => {
  const db = await initDB();
  const query = `SELECT * FROM attributs`;
  return db.all(query);
};

// Mettre à jour un attribut
export const updateAttribut = async (id: number, nom: string) => {
  const db = await initDB();
  const query = `UPDATE attributs SET nom = ? WHERE id = ?`;
  const result = await db.run(query, [nom, id]);
  return result.changes > 0;
};

// Supprimer un attribut
export const deleteAttribut = async (id: number) => {
  const db = await initDB();
  const query = `DELETE FROM attributs WHERE id = ?`;
  const result = await db.run(query, [id]);
  return result.changes > 0;
};

// =====================
// VALEURS D’ATTRIBUTS
// =====================

// Ajouter une valeur à un attribut
export const createAttributValue = async (attributId: number, valeur: string) => {
  const db = await initDB();
  const query = `INSERT INTO attribut_valeurs (attribut_id, valeur) VALUES (?, ?)`;
  const result = await db.run(query, [attributId, valeur]);
  return result.lastID;
};

// Mettre à jour une valeur d’attribut
export const updateAttributValue = async (id: number, valeur: string) => {
  const db = await initDB();
  const query = `UPDATE attribut_valeurs SET valeur = ? WHERE id = ?`;
  const result = await db.run(query, [valeur, id]);
  return result.changes > 0;
};

// Récupérer toutes les valeurs d’un attribut
export const getAttributValuesByAttributId = async (attributId: number) => {
  const db = await initDB();
  const query = `SELECT * FROM attribut_valeurs WHERE attribut_id = ?`;
  return db.all(query, [attributId]);
};

// Supprimer une valeur d’attribut
export const deleteAttributValue = async (id: number) => {
  const db = await initDB();
  const query = `DELETE FROM attribut_valeurs WHERE id = ?`;
  const result = await db.run(query, [id]);
  return result.changes > 0;
};
