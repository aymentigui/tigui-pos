import { createClient, deleteClient, getAllClients, getClientById, updateClient } from "../database/clients.service";
import { ipcMain } from "electron";

export function registerClientHandlers() {
    ipcMain.handle("clients:getAll", async () => {
        try {
            const clients = await getAllClients();
            return clients;
        } catch (error) {
            console.error("Error fetching clients:", error);
            return []; // Return an empty array in case of error
        }
    });

    ipcMain.handle("clients:add", async (event, data) => {
        try {
            const newClient = await createClient(
                data.nom,
                data.prenom,
                data.email,
                data.tel1,
                data.tel2,
                data.address
            );
            return newClient;
        } catch (error) {
            console.error("Error adding client:", error);
            return false; // Return null in case of error
        }
    });

    ipcMain.handle("clients:delete", async (event, id) => {
        try {
            const result = await deleteClient(id);
            return result;
        } catch (error) {
            console.error("Error deleting client:", error);
            return false; // Return false in case of error
        }
    });

    ipcMain.handle("clients:update", async (event, id, data) => {
        try {
            const updatedClient = await updateClient(id, 
                data.nom,
                data.prenom,
                data.email,
                data.tel1,
                data.tel2,
                data.address
            );
            return updatedClient;
        } catch (error) {
            console.error("Error updating client:", error);
            return null; // Return null in case of error
        }
    });

    ipcMain.handle("clients:getById", async (event, id) => {
        try {
            const client = await getClientById(id);
            return client;
        } catch (error) {
            console.error("Error fetching client by ID:", error);
            return null; // Return null in case of error
        }
    });
}
