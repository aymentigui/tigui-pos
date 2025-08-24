import { 
    createFournisseur,
    deleteFournisseur,
    getAllFournisseurs,
    getFournisseurById,
    updateFournisseur
} from "../database/suppliers.service";

import { ipcMain } from "electron";

export function registerFournisseurHandlers() {
    ipcMain.handle("fournisseurs:getAll", async () => {
        try {
            const fournisseurs = await getAllFournisseurs();
            return fournisseurs;
        } catch (error) {
            console.error("Error fetching fournisseurs:", error);
            return [];
        }
    });

    ipcMain.handle("fournisseurs:add", async (event, data) => {
        try {
            const newFournisseur = await createFournisseur(
                data.nom,
                data.prenom,
                data.societe,
                data.email,
                data.tel1,
                data.tel2,
                data.adresse
            );
            return newFournisseur;
        } catch (error) {
            console.error("Error adding fournisseur:", error);
            return false;
        }
    });

    ipcMain.handle("fournisseurs:delete", async (event, id) => {
        try {
            const result = await deleteFournisseur(id);
            return result;
        } catch (error) {
            console.error("Error deleting fournisseur:", error);
            return false;
        }
    });

    ipcMain.handle("fournisseurs:update", async (event, id, data) => {
        try {
            const updatedFournisseur = await updateFournisseur(
                id,
                data.nom,
                data.prenom,
                data.societe,
                data.email,
                data.tel1,
                data.tel2,
                data.adresse
            );
            return updatedFournisseur;
        } catch (error) {
            console.error("Error updating fournisseur:", error);
            return false;
        }
    });

    ipcMain.handle("fournisseurs:getById", async (event, id) => {
        try {
            const fournisseur = await getFournisseurById(id);
            return fournisseur;
        } catch (error) {
            console.error("Error fetching fournisseur by ID:", error);
            return null;
        }
    });
}
