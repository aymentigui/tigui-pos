import { getAllCategories } from "@/database/category/categories.service";
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
    return "1"
  });

  ipcMain.handle("categories:delete", async (event, id) => {
    return "1"
  });
}
