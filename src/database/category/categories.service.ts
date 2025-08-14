import { initDB } from "../connection";
import { 
  createCategoryQuery, 
  getCategoryByIdQuery, 
  getAllCategoriesQuery, 
  updateCategoryQuery, 
  deleteCategoryQuery 
} from "./categories.queries";

// Création d'une catégorie
export const createCategory = async (nom: string, parentId: number | null = null) => {
  const db = await initDB();
  const result = await db.run(createCategoryQuery, [nom, parentId]);
  return result.lastID;
};

// Récupérer une catégorie par ID
export const getCategoryById = async (id: number) => {
  const db = await initDB();
  const result = await db.get(getCategoryByIdQuery, [id]);
  return result;
};

// Récupérer toutes les catégories
export const getAllCategories = async () => {
  const db = await initDB();
  const result = await db.all(getAllCategoriesQuery);
  return result;
};

// Mettre à jour une catégorie
export const updateCategory = async (id: number, nom: string, parentId: number | null = null) => {
  const db = await initDB();
  const result = await db.run(updateCategoryQuery, [nom, parentId, id]);
  return result.changes > 0;
};

// Supprimer une catégorie
export const deleteCategory = async (id: number) => {
  const db = await initDB();
  const result = await db.run(deleteCategoryQuery, [id]);
  return result.changes > 0;
};
