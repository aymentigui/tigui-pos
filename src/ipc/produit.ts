import { ipcMain } from "electron";
import {
  createProduit,
  getProduitById,
  getAllProduits,
  updateProduit,
  deleteProduit,
  getVariationById,
  getAllVariationByProductId,
  getAllTaxesByProductId,
  getAllBrandsByProductId,
  getAllCategoriesByProductId
} from "../database/produits.service";

export function registerProduitHandlers() {
  // =========================
  // GET ALL PRODUITS
  // =========================
  ipcMain.handle("products:getAll", async () => {
    try {
      const produits = await getAllProduits();
      return produits;
    } catch (error) {
      console.error("Error fetching produits:", error);
      return [];
    }
  });

  // =========================
  // ADD PRODUIT
  // =========================
  ipcMain.handle("products:add", async (event, data) => {
    try {
      const produitId = await createProduit(data);
      return produitId;
    } catch (error) {
      console.error("Error adding produit:", error);
      return false;
    }
  });

  // =========================
  // DELETE PRODUIT
  // =========================
  ipcMain.handle("products:delete", async (event, id) => {
    try {
      const result = await deleteProduit(id);
      return result;
    } catch (error) {
      console.error("Error deleting produit:", error);
      return false;
    }
  });

  // =========================
  // UPDATE PRODUIT
  // =========================
  ipcMain.handle("products:update", async (event, id, data) => {
    try {
      const result = await updateProduit(id, data);
      return result;
    } catch (error) {
      console.error("Error updating produit:", error);
      return false;
    }
  });

  // =========================
  // GET PRODUIT BY ID
  // =========================
  ipcMain.handle("products:getById", async (event, id) => {
    try {
      const produit = await getProduitById(id);
      return produit;
    } catch (error) {
      console.error("Error fetching produit by ID:", error);
      return null;
    }
  });

  // =========================
  // GET VARIATION BY ID
  // =========================
  ipcMain.handle("products:getVariationById", async (event, id) => {
    try {
      const variation = await getVariationById(id);
      return variation;
    } catch (error) {
      console.error("Error fetching variation by ID:", error);
      return null;
    }
  });
  // =========================

  ipcMain.handle("products:getAllVariationsByProductId", async (event, productId) => {
    try {
      const variations = await getAllVariationByProductId(productId);
      return variations;
    } catch (error) {
      console.error("Error fetching variations by product ID:", error);
      return [];
    }
  }
  );

  // =========================

  // GET ALL categories by product ID

  ipcMain.handle("products:getAllCategoriesByProductId", async (event, productId) => {
    try {
      const brands = await getAllCategoriesByProductId(productId);
      return brands;
    } catch (error) {
      console.error("Error fetching brands by product ID:", error);
      return [];
    }
  });
  ipcMain.handle("products:getAllBrandsByProductId", async (event, productId) => {
    try {
      const brands = await getAllBrandsByProductId(productId);
      return brands;
    } catch (error) {
      console.error("Error fetching brands by product ID:", error);
      return [];
    }
  });
  ipcMain.handle("products:getAllTaxesByProductId", async (event, productId) => {
    try {
      const brands = await getAllTaxesByProductId(productId);
      return brands;
    } catch (error) {
      console.error("Error fetching brands by product ID:", error);
      return [];
    }
  });

}
