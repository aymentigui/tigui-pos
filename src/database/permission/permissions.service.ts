import { initDB } from "../connection";
import { getUserPermissionsQuery } from "./permissions.queries";

// Récupérer les permissions d'un utilisateur par son ID
export const getUserPermissions = async (userId: number) => {
  const db = await initDB();
  const result = await db.all(getUserPermissionsQuery, [userId]);
  // On retourne un tableau de permissions (strings)
  return result.map((row: any) => row.permission);
};
