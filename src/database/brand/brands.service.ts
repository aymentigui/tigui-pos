import { initDB } from "../connection";
import { 
  createBrandQuery, 
  getBrandByIdQuery, 
  getAllBrandsQuery, 
  updateBrandQuery, 
  deleteBrandQuery 
} from "./brands.queries";

// Créer une marque
export const createBrand = async (nom: string) => {
  const db = await initDB();
  const result = await db.run(createBrandQuery, [nom]);
  return result.lastID;
};

// Récupérer une marque par ID
export const getBrandById = async (id: number) => {
  const db = await initDB();
  const result = await db.get(getBrandByIdQuery, [id]);
  return result;
};

// Récupérer toutes les marques
export const getAllBrands = async () => {
  const db = await initDB();
  const result = await db.all(getAllBrandsQuery);
  return result;
};

// Mettre à jour une marque
export const updateBrand = async (id: number, nom: string) => {
  const db = await initDB();
  const result = await db.run(updateBrandQuery, [nom, id]);
  return result.changes > 0;
};

// Supprimer une marque
export const deleteBrand = async (id: number) => {
  const db = await initDB();
  const result = await db.run(deleteBrandQuery, [id]);
  return result.changes > 0;
};
