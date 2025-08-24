import { ipcMain } from "electron";
import {
  createBonCommande,
  getBonCommandeById,
  getAllBonCommandes,
  updateBonCommande,
  deleteBonCommande,
} from "../database/bonCommande.service";

export function registerBonCommandeHandlers() {
  // =========================
  // GET ALL BON COMMANDES
  // =========================
  ipcMain.handle("bonCommande:getAll", async () => {
    try {
      return await getAllBonCommandes();
    } catch (error) {
      console.error("Error fetching bon commandes:", error);
      return [];
    }
  });

  // =========================
  // GET BON COMMANDE BY ID
  // =========================
  ipcMain.handle("bonCommande:getById", async (event, id: number) => {
    try {
      return await getBonCommandeById(id);
    } catch (error) {
      console.error("Error fetching bon commande by ID:", error);
      return null;
    }
  });

  // =========================
  // CREATE BON COMMANDE
  // =========================
  ipcMain.handle(
    "bonCommande:add",
    async (
      event,
      fournisseurId: number | null,
      dateCommande: string,
      reductionType: string | null,
      reductionValeur: number,
      produits: Array<{
        produitId: number | null;
        variationId: number | null;
        quantite: number;
        prixAchat: number;
        prixAchatTtc: number;
      }>,
      frais: Array<{ nom: string; montant: number }>
    ) => {
      try {
        return await createBonCommande(
          fournisseurId,
          dateCommande,
          reductionType,
          reductionValeur,
          produits,
          frais
        );
      } catch (error) {
        console.error("Error creating bon commande:", error);
        return false;
      }
    }
  );

  // =========================
  // UPDATE BON COMMANDE
  // =========================
  ipcMain.handle(
    "bonCommande:update",
    async (
      event,
      id: number,
      fournisseurId: number | null,
      dateCommande: string,
      reductionType: string | null,
      reductionValeur: number,
      produits: Array<{
        produitId: number | null;
        variationId: number | null;
        quantite: number;
        prixAchat: number;
        prixAchatTtc: number;
      }>,
      frais: Array<{ nom: string; montant: number }>
    ) => {
      try {
        return await updateBonCommande(
          id,
          fournisseurId,
          dateCommande,
          reductionType,
          reductionValeur,
          produits,
          frais
        );
      } catch (error) {
        console.error("Error updating bon commande:", error);
        return false;
      }
    }
  );

  // =========================
  // DELETE BON COMMANDE
  // =========================
  ipcMain.handle("bonCommande:delete", async (event, id: number) => {
    try {
      return await deleteBonCommande(id);
    } catch (error) {
      console.error("Error deleting bon commande:", error);
      return false;
    }
  });
}
