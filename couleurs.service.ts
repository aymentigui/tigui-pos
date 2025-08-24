import { initDB } from "../connection";

// Créer une couleur
export const createCouleur = async (nom: string, valeur: string) => {
  const db = await initDB();
  const query = `INSERT INTO couleurs (nom, valeur) VALUES (?, ?)`;
  const result = await db.run(query, [nom, valeur]);
  return result.lastID;
};

// Récupérer une couleur par ID
export const getCouleurById = async (id: number) => {
  const db = await initDB();
  const query = `SELECT * FROM couleurs WHERE id = ?`;
  return db.get(query, [id]);
};

// Récupérer toutes les couleurs
export const getAllCouleurs = async () => {
  const db = await initDB();
  const query = `SELECT * FROM couleurs`;
  return db.all(query);
};

// Mettre à jour une couleur
export const updateCouleur = async (id: number, nom: string, valeur: string) => {
  const db = await initDB();
  const query = `UPDATE couleurs SET nom = ?, valeur = ? WHERE id = ?`;
  const result = await db.run(query, [nom, valeur, id]);
  return result.changes > 0;
};

// Supprimer une couleur
export const deleteCouleur = async (id: number) => {
  const db = await initDB();
  const query = `DELETE FROM couleurs WHERE id = ?`;
  const result = await db.run(query, [id]);
  return result.changes > 0;
};
