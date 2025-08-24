import { initDB } from "./connection";

export const createClient = async (
  nom: string, 
  prenom: string, 
  email: string, 
  tel1: string, 
  tel2: string, 
  adresse: string
) => {
  const db = await initDB();
  const query = `
    INSERT INTO clients (nom, prenom, email, tel1, tel2, adresse) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const result = await db.run(query, [nom, prenom, email, tel1, tel2, adresse]);
  return result.lastID;
};

export const getClientById = async (id: number) => {
  const db = await initDB();
  const query = `SELECT * FROM clients WHERE id = ?`;
  const result = await db.get(query, [id]);
  return result;
};

export const getAllClients = async () => {
  const db = await initDB();
  const query = `SELECT * FROM clients`;
  const result = await db.all(query);
  return result;
};

export const updateClient = async (
  id: number,
  nom: string, 
  prenom: string, 
  email: string, 
  tel1: string, 
  tel2: string, 
  adresse: string
) => {
  const db = await initDB();
  const query = `
    UPDATE clients 
    SET nom = ?, prenom = ?, email = ?, tel1 = ?, tel2 = ?, adresse = ? 
    WHERE id = ?
  `;
  const result = await db.run(query, [nom, prenom, email, tel1, tel2, adresse, id]);
  return result.changes > 0;
};

export const deleteClient = async (id: number) => {
  const db = await initDB();
  const query = `DELETE FROM clients WHERE id = ?`;
  const result = await db.run(query, [id]);
  return result.changes > 0;
};
