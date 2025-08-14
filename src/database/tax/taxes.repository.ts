import { Database } from "sqlite3";
import { 
  createTaxQuery,
  getTaxByIdQuery,
  getAllTaxesQuery,
  updateTaxQuery,
  deleteTaxQuery
} from "./taxes.queries";

export class TaxRepository {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  createTax(nom: string, valeur: number, type: "percentage" | "addition"): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(createTaxQuery, [nom, valeur, type], function (err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  getTaxById(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(getTaxByIdQuery, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  getAllTaxes(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(getAllTaxesQuery, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  updateTax(id: number, nom: string, valeur: number, type: "percentage" | "addition"): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(updateTaxQuery, [nom, valeur, type, id], function (err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  deleteTax(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(deleteTaxQuery, [id], function (err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
