import { createTax, deleteTax, getAllTaxes, getTaxById, updateTax } from "../database/tax/taxes.service";
import { ipcMain } from "electron";

export function registerTaxHandlers() {
    // Initialiser le repository avec la DB

    ipcMain.handle("taxes:getAll", async () => {
        try {
            const taxes = await getAllTaxes();
            return taxes;
        } catch (error) {
            console.error("Error fetching taxes:", error);
            return [];
        }
    });

    ipcMain.handle("taxes:add", async (event, data) => {
        try {
            console.log("Adding tax:", data);

            const result=await createTax(data.nom, data.valeur, data.type);
            return result;
        } catch (error) {
            console.error("Error adding tax:", error);
            return false;
        }
    });

    ipcMain.handle("taxes:delete", async (event, id) => {
        try {
            const result=await deleteTax(id);
            return result;
        } catch (error) {
            console.error("Error deleting tax:", error);
            return false;
        }
    });

    ipcMain.handle("taxes:update", async (event, id, data) => {
        try {
            const result=await updateTax(id, data.nom, data.valeur, data.type);
            return result;
        } catch (error) {
            console.error("Error updating tax:", error);
            return false;
        }
    });

    ipcMain.handle("taxes:getById", async (event, id) => {
        try {
            const tax = await getTaxById(id);
            return tax;
        } catch (error) {
            console.error("Error fetching tax by ID:", error);
            return null;
        }
    });
}
