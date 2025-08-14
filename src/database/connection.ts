import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Ouvre la connexion SQLite
export const initDB = async () => {
    const db = await open({
        filename: "database.sqlite",
        driver: sqlite3.Database,
    });

    // Exemple de création de table (tu peux aussi mettre ça dans un fichier migrations.sql)
    await db.exec(`
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    categorie_id INTEGER,
    FOREIGN KEY (categorie_id) REFERENCES categorie (id)
);
  `);

    return db;
};

