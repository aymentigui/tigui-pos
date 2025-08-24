import { initDB } from "./connection";
// Récupérer les permissions d'un utilisateur par son ID
export const getUserPermissions = async (userId: number) => {
  const db = await initDB();
  const getUserPermissionsQuery = `
  SELECT p.name AS permission
  FROM users u
  JOIN roles r ON r.id = u.role_id
  JOIN role_permissions rp ON rp.role_id = r.id
  JOIN permissions p ON p.id = rp.permission_id
  WHERE u.id = ?;
`;
  const result = await db.all(getUserPermissionsQuery, [userId]);
  // On retourne un tableau de permissions (strings)
  return result.map((row: any) => row.permission);
};
