import { initDB } from "../connection";
import { 
  createClientQuery, 
  getClientByIdQuery, 
  getAllClientsQuery, 
  updateClientQuery, 
  deleteClientQuery 
} from "./clients.queries";

export const createClient = async (
  nom: string, 
  prenom: string, 
  email: string, 
  tel1: string, 
  tel2: string, 
  adresse: string
) => {
  const db = await initDB();
  const result = await db.run(createClientQuery, [nom, prenom, email, tel1, tel2, adresse]);
  return result.lastID;
};

export const getClientById = async (id: number) => {
  const db = await initDB();
  const result = await db.get(getClientByIdQuery, [id]);
  return result;
};

export const getAllClients = async () => {
  const db = await initDB();
  const result = await db.all(getAllClientsQuery);
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
  const result = await db.run(updateClientQuery, [nom, prenom, email, tel1, tel2, adresse, id]);
  return result.changes > 0;
};

export const deleteClient = async (id: number) => {
  const db = await initDB();
  const result = await db.run(deleteClientQuery, [id]);
  return result.changes > 0;
};
