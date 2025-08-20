import { getAllBrands,createBrand, deleteBrand, updateBrand, getBrandById } from "../database/brand/brands.service";
import { ipcMain } from "electron";

export function registerBrandHandlers() {
    ipcMain.handle("brands:getAll", async () => {
        try {
            const brands = await getAllBrands();
            return brands;
        } catch (error) {
            console.error("Error fetching brands:", error);
            return []; // Return an empty array in case of error
        }
    });

    ipcMain.handle("brands:add", async (event, data) => {
        try {
            const newBrand = await createBrand(data);
            return newBrand;
        } catch (error) {
            console.error("Error adding brand:", error);
            return false; // Return null in case of error
        }
    });

    ipcMain.handle("brands:delete", async (event, id) => {
        try {
            const result = await deleteBrand(id);
            return result;
        } catch (error) {
            console.error("Error deleting brand:", error);
            return false; // Return false in case of error
        }
    });

    ipcMain.handle("brands:update", async (event, id, data) => {
        try {
            const updatedBrand = await updateBrand(id, data);
            return updatedBrand;
        } catch (error) {
            console.error("Error updating brand:", error);
            return null; // Return null in case of error
        }
    });

    ipcMain.handle("brands:getById", async (event, id) => {
        try {
            const brand = await getBrandById(id);
            return brand;
        } catch (error) {
            console.error("Error fetching brand by ID:", error);
            return null; // Return null in case of error
        }
    });
}
