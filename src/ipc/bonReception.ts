import { ipcMain } from "electron";
import {
  createBonReception,
  getBonReceptionById,
  getAllBonReceptions,
  updateBonReception,
  deleteBonReception,
} from "../database/bon-reception/bonReception.service";

export function registerBonReceptionHandlers() {
  // =========================
  // GET ALL BON RECEPTIONS
  // =========================
  ipcMain.handle("bonReception:getAll", async () => {
    try {
      return await getAllBonReceptions();
    } catch (error) {
      console.error("Error fetching bon receptions:", error);
      return [];
    }
  });

  // =========================
  // GET BON RECEPTION BY ID
  // =========================
  ipcMain.handle("bonReception:getById", async (event, id: number) => {
    try {
      return await getBonReceptionById(id);
    } catch (error) {
      console.error("Error fetching bon reception by ID:", error);
      return null;
    }
  });

  // =========================
  // CREATE BON RECEPTION
  // =========================
  ipcMain.handle(
    "bonReception:add",
    async (
      event,
      bonCommandeId: number | null,
      livreurNom: string | null,
      dateReception: string,
      produits: Array<{
        produitId: number | null;
        variationId: number | null;
        quantite: number;
      }>
    ) => {
      try {
        return await createBonReception(
          bonCommandeId,
          livreurNom,
          dateReception,
          produits
        );
      } catch (error) {
        console.error("Error creating bon reception:", error);
        return false;
      }
    }
  );

  // =========================
  // UPDATE BON RECEPTION
  // =========================
  ipcMain.handle(
    "bonReception:update",
    async (
      event,
      id: number,
      bonCommandeId: number | null,
      livreurNom: string | null,
      dateReception: string,
      produits: Array<{
        produitId: number | null;
        variationId: number | null;
        quantite: number;
      }>
    ) => {
      try {
        return await updateBonReception(
          id,
          bonCommandeId,
          livreurNom,
          dateReception,
          produits
        );
      } catch (error) {
        console.error("Error updating bon reception:", error);
        return false;
      }
    }
  );

  // =========================
  // DELETE BON RECEPTION
  // =========================
  ipcMain.handle("bonReception:delete", async (event, id: number) => {
    try {
      return await deleteBonReception(id);
    } catch (error) {
      console.error("Error deleting bon reception:", error);
      return false;
    }
  });
}
