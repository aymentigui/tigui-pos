import { 
    createUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser,
    getUserByUsername,
    getUserByEmail
} from "../database/user/users.service";

import { ipcMain } from "electron";

export function registerUserHandlers() {
    ipcMain.handle("users:getAll", async () => {
        try {
            const users = await getAllUsers();
            return users;
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    });

    ipcMain.handle("users:add", async (event, data) => {
        try {
            const newUser = await createUser(
                data.nom,
                data.prenom,
                data.username,
                data.email,
                data.password,
                data.tel1,
                data.tel2,
                data.role,
                data.is_admin ?? 0
            );
            return newUser;
        } catch (error) {
            console.error("Error adding user:", error);
            return false;
        }
    });

    ipcMain.handle("users:delete", async (event, id) => {
        try {
            const result = await deleteUser(id);
            return result;
        } catch (error) {
            console.error("Error deleting user:", error);
            return false;
        }
    });

    ipcMain.handle("users:update", async (event, id, data) => {
        try {
            const updatedUser = await updateUser(
                id,
                data.nom,
                data.prenom,
                data.username,
                data.email,
                data.password,
                data.tel1,
                data.tel2,
                data.role,
                data.is_admin ?? 0
            );
            return updatedUser;
        } catch (error) {
            console.error("Error updating user:", error);
            return false;
        }
    });

    ipcMain.handle("users:getById", async (event, id) => {
        try {
            const user = await getUserById(id);
            return user;
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            return null;
        }
    });

    ipcMain.handle("users:getByUsername", async (event, username) => {
        try {
            const user = await getUserByUsername(username);
            return user;
        } catch (error) {
            console.error("Error fetching user by username:", error);
            return null;
        }
    });

    ipcMain.handle("users:getByEmail", async (event, email) => {
        try {
            const user = await getUserByEmail(email);
            return user;
        } catch (error) {
            console.error("Error fetching user by email:", error);
            return null;
        }
    });
}
