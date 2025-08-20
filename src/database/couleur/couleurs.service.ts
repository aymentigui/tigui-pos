import { initDB } from "../connection";
import { 
  createCouleurQuery,
  getCouleurByIdQuery,
  getAllCouleursQuery,
  updateCouleurQuery,
  deleteCouleurQuery
} from "./couleurs.queries";

// Créer une couleur
export const createCouleur = async (nom: string, valeur: string) => {
  const db = await initDB();
  console.log("Creating couleur with name:", nom, "and value:", valeur);
  const result = await db.run(createCouleurQuery, [nom, valeur]);
  return result.lastID;
};

// Récupérer une couleur
export const getCouleurById = async (id: number) => {
  const db = await initDB();
  return db.get(getCouleurByIdQuery, [id]);
};

// Récupérer toutes les couleurs
export const getAllCouleurs = async () => {
  const db = await initDB();
  return db.all(getAllCouleursQuery);
};

// Mettre à jour une couleur
export const updateCouleur = async (id: number, nom: string, valeur: string) => {
  const db = await initDB();
  const result = await db.run(updateCouleurQuery, [nom, valeur, id]);
  return result.changes > 0;
};

// Supprimer une couleur
export const deleteCouleur = async (id: number) => {
  const db = await initDB();
  const result = await db.run(deleteCouleurQuery, [id]);
  return result.changes > 0;
};
