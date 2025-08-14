import { initDB } from "../connection";
import { 
  createFournisseurQuery,
  getFournisseurByIdQuery,
  getAllFournisseursQuery,
  updateFournisseurQuery,
  deleteFournisseurQuery
} from "./suppliers.queries";

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
  const result = await db.run(createFournisseurQuery, [nom, prenom, societe, email, tel1, tel2, adresse]);
  return result.lastID;
};

export const getFournisseurById = async (id: number) => {
  const db = await initDB();
  const result = await db.get(getFournisseurByIdQuery, [id]);
  return result;
};

export const getAllFournisseurs = async () => {
  const db = await initDB();
  const result = await db.all(getAllFournisseursQuery);
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
  const result = await db.run(updateFournisseurQuery, [nom, prenom, societe, email, tel1, tel2, adresse, id]);
  return result.changes > 0;
};

export const deleteFournisseur = async (id: number) => {
  const db = await initDB();
  const result = await db.run(deleteFournisseurQuery, [id]);
  return result.changes > 0;
};
