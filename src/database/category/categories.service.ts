import { initDB } from "../connection";
import { createCategoryQuery } from "./categories.queries";
import { getCategoryByIdQuery, getAllCategoriesQuery, updateCategoryQuery, deleteCategoryQuery } from "./categories.queries";

export const createCategory = async (name:string) => {
  const db = await initDB();
  const result = await db.run(createCategoryQuery, [name]);
  return result.lastID;
};

export const getCategoryById = async (id: number) => {
    const db = await initDB();
    const result = await db.get(getCategoryByIdQuery, [id]);
    return result;
};

export const getAllCategories = async () => {
    const db = await initDB();
    const result = await db.all(getAllCategoriesQuery);
    return result;
};

export const updateCategory = async (id: number, name: string) => {
    const db = await initDB();
    const result = await db.run(updateCategoryQuery, [name, id]);
    return result.changes > 0;
};

export const deleteCategory = async (id: number) => {
    const db = await initDB();
    const result = await db.run(deleteCategoryQuery, [id]);
    return result.changes > 0;
};
