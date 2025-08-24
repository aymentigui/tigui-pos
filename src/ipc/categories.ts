import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../database/categories.service";
import { ipcMain } from "electron";

export function registerCategoryHandlers() {
  ipcMain.handle("categories:getAll", async () => {
    try {
      const categories = await getAllCategories()
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return []; // Return an empty array in case of error
    }
  });

  ipcMain.handle("categories:add", async (event, data) => {
    try {
      const newCategory = await createCategory(data.nom, data.parentId || null);
      return newCategory;
    } catch (error) {
      console.error("Error adding category:", error);
      return false; // Return null in case of error
    }
  });

  ipcMain.handle("categories:delete", async (event, id) => {
    try {
      const result = await deleteCategory(id);
      return result;
    } catch (error) {
      console.error("Error deleting category:", error);
      return false; // Return false in case of error
    }
  });
  ipcMain.handle("categories:update", async (event, id, data) => {
    try {
      const updatedCategory = await updateCategory(id, data.nom, data.parentId || null);
      return updatedCategory;
    } catch (error) {
      console.error("Error updating category:", error);
      return null; // Return null in case of error
    }
  });

  ipcMain.handle("categories:getById", async (event, id) => {
    try {
      const category = await getCategoryById(id);
      return category;
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      return null; // Return null in case of error
    }
  });
}
