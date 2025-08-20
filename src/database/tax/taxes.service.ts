import {
  createTaxQuery,
  getTaxByIdQuery,
  getAllTaxesQuery,
  updateTaxQuery,
  deleteTaxQuery
} from "./taxes.queries";
import { initDB } from "../connection";

export async function createTax(nom: string, valeur: number, type: "percentage" | "addition"): Promise < boolean> {
  const db = await initDB();
  try {
    const result = await db.run(createTaxQuery, [nom, valeur, type]);
    return result.changes > 0; // Returns true if a row was inserted
  } catch (error) {
    return false;
  }
}

export async function  getTaxById(id: number): Promise < any > {
  const db = await initDB();
  try {
    const tax = await db.get(getTaxByIdQuery, [id], (err:any, row:any) => {
      if (err) {
        return null;
      }
      return row;
    });
    return tax;
  }catch (error) {
    return null;
  }
}

export async function getAllTaxes(): Promise < any[] > {
  const db = await initDB();
  try {
    const taxes = await db.all(getAllTaxesQuery, [],(err:any,rows:any)=>{
      if (err) {
        return [];
      }
      return rows;
    });
    return taxes;
  } catch (error) {
    return [];
  }
}

export async function updateTax(id: number, nom: string, valeur: number, type: "percentage" | "addition"): Promise < Boolean > {
  const db = await initDB();
  try {
    const result = await db.run(updateTaxQuery, [nom, valeur, type, id]);
    return result.changes > 0; // Returns true if a row was updated
  }catch (error) {
    console.error("Error updating tax:", error);
    return false
  }
}

export async function deleteTax(id: number): Promise < Boolean> {
  const db = await initDB();
  try {
    const result = await db.run(deleteTaxQuery, [id]);
    return result.changes > 0; // Returns true if a row was deleted
  } catch (error) {
    return false;
  }
}

