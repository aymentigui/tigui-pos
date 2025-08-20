import { ipcMain } from "electron";
import {
  createAttribut,
  getAttributById,
  getAllAttributs,
  updateAttribut,
  deleteAttribut,
  createAttributValue,
  getAttributValuesByAttributId,
  deleteAttributValue,
  updateAttributValue,
} from "../database/attribut/attributs.service";

export function registerAttributHandlers() {
  // =========================
  // GET ALL ATTRIBUTS
  // =========================
  ipcMain.handle("attributs:getAll", async () => {
    try {
      return await getAllAttributs();
    } catch (error) {
      console.error("Error fetching attributs:", error);
      return [];
    }
  });

  // =========================
  // ADD ATTRIBUT
  // =========================
  ipcMain.handle("attributs:add", async (event, nom: string) => {
    try {
      return await createAttribut(nom);
    } catch (error) {
      console.error("Error adding attribut:", error);
      return false;
    }
  });

  // =========================
  // GET ATTRIBUT BY ID
  // =========================
  ipcMain.handle("attributs:getById", async (event, id: number) => {
    try {
      return await getAttributById(id);
    } catch (error) {
      console.error("Error fetching attribut by ID:", error);
      return null;
    }
  });

  // =========================
  // UPDATE ATTRIBUT
  // =========================
  ipcMain.handle(
    "attributs:update",
    async (event, id: number, nom: string) => {
      try {
        return await updateAttribut(id, nom);
      } catch (error) {
        console.error("Error updating attribut:", error);
        return false;
      }
    }
  );

  // =========================
  // DELETE ATTRIBUT
  // =========================
  ipcMain.handle("attributs:delete", async (event, id: number) => {
    try {
      return await deleteAttribut(id);
    } catch (error) {
      console.error("Error deleting attribut:", error);
      return false;
    }
  });

  // =========================
  // GET VALUES OF ATTRIBUT
  // =========================
  ipcMain.handle("attributs:getValues", async (event, attributId: number) => {
    try {
      return await getAttributValuesByAttributId(attributId);
    } catch (error) {
      console.error("Error fetching attribut values:", error);
      return [];
    }
  });

  // =========================
  // ADD VALUE TO ATTRIBUT
  // =========================
  ipcMain.handle(
    "attributs:addValue",
    async (event, attributId: number, valeur: string) => {
      try {
        return await createAttributValue(attributId, valeur);
      } catch (error) {
        console.error("Error adding attribut value:", error);
        return null;
      }
    }
  );

  ipcMain.handle(
    "attributs:updateValue",
    async (event, id: number, valeur: string) => {
      try {
        // Assuming you have an updateAttributValue function in your service
        return await updateAttributValue(id, valeur);
      } catch (error) {
        console.error("Error updating attribut value:", error);
        return false;
      }
    }
  );

  // =========================
  // DELETE VALUE
  // =========================
  ipcMain.handle("attributs:deleteValue", async (event, id: number) => {
    try {
      return await deleteAttributValue(id);
    } catch (error) {
      console.error("Error deleting attribut value:", error);
      return false;
    }
  });
}
