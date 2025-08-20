import { ipcMain } from "electron";
import {
  createCouleur,
  getCouleurById,
  getAllCouleurs,
  updateCouleur,
  deleteCouleur,
} from "../database/couleur/couleurs.service";

export function registerCouleurHandlers() {
  // =========================
  // GET ALL COULEURS
  // =========================
  ipcMain.handle("couleurs:getAll", async () => {
    try {
      const couleurs = await getAllCouleurs();
      return couleurs;
    } catch (error) {
      console.error("Error fetching couleurs:", error);
      return [];
    }
  });

  // =========================
  // ADD COULEUR
  // =========================
  ipcMain.handle("couleurs:add", async (event, data:any) => {
    try {
      const id = await createCouleur(data.nom, data.valeur);
      return id;
    } catch (error) {
      console.error("Error adding couleur:", error);
      return false;
    }
  });

  // =========================
  // GET COULEUR BY ID
  // =========================
  ipcMain.handle("couleurs:getById", async (event, id: number) => {
    try {
      const couleur = await getCouleurById(id);
      return couleur;
    } catch (error) {
      console.error("Error fetching couleur by ID:", error);
      return null;
    }
  });

  // =========================
  // UPDATE COULEUR
  // =========================
  ipcMain.handle(
    "couleurs:update",
    async (event, id: number, data:any) => {
      try {
        const result = await updateCouleur(id, data.nom, data.valeur);
        return result;
      } catch (error) {
        console.error("Error updating couleur:", error);
        return false;
      }
    }
  );

  // =========================
  // DELETE COULEUR
  // =========================
  ipcMain.handle("couleurs:delete", async (event, id: number) => {
    try {
      const result = await deleteCouleur(id);
      return result;
    } catch (error) {
      console.error("Error deleting couleur:", error);
      return false;
    }
  });
}
