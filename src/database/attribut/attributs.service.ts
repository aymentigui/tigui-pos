import { initDB } from "../connection";
import { 
  createAttributQuery,
  getAttributByIdQuery,
  getAllAttributsQuery,
  updateAttributQuery,
  deleteAttributQuery,
  createAttributValueQuery,
  getAttributValuesByAttributIdQuery,
  deleteAttributValueQuery
} from "./attributs.queries";

// Créer un attribut
export const createAttribut = async (nom: string) => {
  const db = await initDB();
  const result = await db.run(createAttributQuery, [nom]);
  return result.lastID;
};

// Récupérer un attribut
export const getAttributById = async (id: number) => {
  const db = await initDB();
  return db.get(getAttributByIdQuery, [id]);
};

// Récupérer tous les attributs
export const getAllAttributs = async () => {
  const db = await initDB();
  return db.all(getAllAttributsQuery);
};

// Mettre à jour un attribut
export const updateAttribut = async (id: number, nom: string) => {
  const db = await initDB();
  const result = await db.run(updateAttributQuery, [nom, id]);
  return result.changes > 0;
};

// Supprimer un attribut
export const deleteAttribut = async (id: number) => {
  const db = await initDB();
  const result = await db.run(deleteAttributQuery, [id]);
  return result.changes > 0;
};

// =====================
// GESTION DES VALEURS
// =====================

// Ajouter une valeur à un attribut
export const createAttributValue = async (attributId: number, valeur: string) => {
  const db = await initDB();
  const result = await db.run(createAttributValueQuery, [attributId, valeur]);
  return result.lastID;
};

// Récupérer toutes les valeurs d’un attribut
export const getAttributValuesByAttributId = async (attributId: number) => {
  const db = await initDB();
  return db.all(getAttributValuesByAttributIdQuery, [attributId]);
};

// Supprimer une valeur
export const deleteAttributValue = async (id: number) => {
  const db = await initDB();
  const result = await db.run(deleteAttributValueQuery, [id]);
  return result.changes > 0;
};
