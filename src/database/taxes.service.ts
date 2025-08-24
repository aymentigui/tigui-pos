import { initDB } from "./connection";

export async function createTax(
  nom: string,
  valeur: number,
  type: "percentage" | "addition"
): Promise<boolean> {
  const db = await initDB();
  const query = `INSERT INTO taxes (nom, valeur, type) VALUES (?, ?, ?)`;
  try {
    const result = await db.run(query, [nom, valeur, type]);
    return result.changes > 0; // true si inséré
  } catch (error) {
    console.error("Error creating tax:", error);
    return false;
  }
}

export async function getTaxById(id: number): Promise<any> {
  const db = await initDB();
  const query = `SELECT * FROM taxes WHERE id = ?`;
  try {
    const tax = await db.get(query, [id]);
    return tax;
  } catch (error) {
    console.error("Error fetching tax:", error);
    return null;
  }
}

export async function getAllTaxes(): Promise<any[]> {
  const db = await initDB();
  const query = `SELECT * FROM taxes`;
  try {
    const taxes = await db.all(query);
    return taxes;
  } catch (error) {
    console.error("Error fetching all taxes:", error);
    return [];
  }
}

export async function updateTax(
  id: number,
  nom: string,
  valeur: number,
  type: "percentage" | "addition"
): Promise<boolean> {
  const db = await initDB();
  const query = `UPDATE taxes SET nom = ?, valeur = ?, type = ? WHERE id = ?`;
  try {
    const result = await db.run(query, [nom, valeur, type, id]);
    return result.changes > 0; // true si mis à jour
  } catch (error) {
    console.error("Error updating tax:", error);
    return false;
  }
}

export async function deleteTax(id: number): Promise<boolean> {
  const db = await initDB();
  const query = `DELETE FROM taxes WHERE id = ?`;
  try {
    const result = await db.run(query, [id]);
    return result.changes > 0; // true si supprimé
  } catch (error) {
    console.error("Error deleting tax:", error);
    return false;
  }
}
