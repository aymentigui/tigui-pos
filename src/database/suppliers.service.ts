import { initDB } from "./connection";

export const createFournisseur = async (
  nom: string,
  prenom: string,
  societe: string,
  email: string,
  tel1: string,
  tel2: string,
  adresse: string
) => {
  const db = await initDB();
  const query = `
    INSERT INTO fournisseurs (nom, prenom, societe, email, tel1, tel2, adresse)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const result = await db.run(query, [nom, prenom, societe, email, tel1, tel2, adresse]);
  return result.lastID;
};

export const getFournisseurById = async (id: number) => {
  const db = await initDB();
  const query = `SELECT * FROM fournisseurs WHERE id = ?`;
  const result = await db.get(query, [id]);
  return result;
};

export const getAllFournisseurs = async () => {
  const db = await initDB();
  const query = `SELECT * FROM fournisseurs`;
  const result = await db.all(query);
  return result;
};

export const updateFournisseur = async (
  id: number,
  nom: string,
  prenom: string,
  societe: string,
  email: string,
  tel1: string,
  tel2: string,
  adresse: string
) => {
  const db = await initDB();
  const query = `
    UPDATE fournisseurs
    SET nom = ?, prenom = ?, societe = ?, email = ?, tel1 = ?, tel2 = ?, adresse = ?
    WHERE id = ?
  `;
  const result = await db.run(query, [nom, prenom, societe, email, tel1, tel2, adresse, id]);
  return result.changes > 0;
};

export const deleteFournisseur = async (id: number) => {
  const db = await initDB();
  const query = `DELETE FROM fournisseurs WHERE id = ?`;
  const result = await db.run(query, [id]);
  return result.changes > 0;
};
