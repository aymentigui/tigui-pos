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
-- =========================
-- USERS
-- =========================
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT,
    prenom TEXT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    tel1 TEXT,
    tel2 TEXT,
    role TEXT, -- ex: admin, caissier, manager...
    is_admin INTEGER DEFAULT 0
);

-- =========================
-- CLIENTS
-- =========================
CREATE TABLE clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT,
    prenom TEXT,
    email TEXT,
    tel1 TEXT,
    tel2 TEXT,
    adresse TEXT
);

-- =========================
-- FOURNISSEURS
-- =========================
CREATE TABLE fournisseurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT,
    prenom TEXT,
    societe TEXT,
    email TEXT,
    tel1 TEXT,
    tel2 TEXT,
    adresse TEXT
);

-- =========================
-- BRANDS (MARQUES)
-- =========================
CREATE TABLE brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL
);

-- =========================
-- CATEGORIES
-- =========================
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    parent_id INTEGER,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- =========================
-- TAXES
-- =========================
CREATE TABLE taxes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    valeur REAL NOT NULL,
    type TEXT CHECK(type IN ('percentage','addition')) NOT NULL
);

-- =========================
-- ATTRIBUTS
-- =========================
CREATE TABLE attributs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL -- ex: "Taille", "Couleur"
);

CREATE TABLE attribut_valeurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attribut_id INTEGER NOT NULL,
    valeur TEXT NOT NULL, -- ex: "M", "L", "XL" ou "Rouge", "Bleu"
    FOREIGN KEY (attribut_id) REFERENCES attributs(id) ON DELETE CASCADE
);

-- =========================
-- COULEURS
-- =========================
CREATE TABLE couleurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    valeur TEXT NOT NULL -- code hex par ex: #FFFFFF
);

-- =========================
-- PRODUITS
-- =========================
CREATE TABLE produits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    code_barre TEXT UNIQUE,
    type TEXT CHECK(type IN ('simple','variable')) NOT NULL DEFAULT 'simple',
    prix_achat REAL NOT NULL DEFAULT 0,
    prix_achat_ttc REAL NOT NULL DEFAULT 0,
    prix_vente REAL NOT NULL DEFAULT 0,
    quantite_stock INTEGER DEFAULT 0,
    image TEXT,
    actif INTEGER DEFAULT 1
);

-- =========================
-- VARIATIONS DE PRODUITS
-- (chaque variation a son stock, prix, image, etc.)
-- =========================
CREATE TABLE produit_variations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produit_id INTEGER NOT NULL,
    nom TEXT,
    prix_achat REAL NOT NULL DEFAULT 0,
    prix_achat_ttc REAL NOT NULL DEFAULT 0,
    prix_vente REAL NOT NULL DEFAULT 0,
    quantite_stock INTEGER DEFAULT 0,
    image TEXT,
    actif INTEGER DEFAULT 1,
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
);

-- =========================
-- RELATIONS PRODUIT <-> CATEGORY
-- =========================
CREATE TABLE produit_categories (
    produit_id INTEGER,
    categorie_id INTEGER,
    PRIMARY KEY (produit_id, categorie_id),
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE,
    FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- =========================
-- RELATIONS PRODUIT <-> BRAND
-- =========================
CREATE TABLE produit_brands (
    produit_id INTEGER,
    brand_id INTEGER,
    PRIMARY KEY (produit_id, brand_id),
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
);

-- =========================
-- RELATIONS PRODUIT <-> TAXES (ex: plusieurs taxes sur achat)
-- =========================
CREATE TABLE produit_taxes (
    produit_id INTEGER,
    tax_id INTEGER,
    PRIMARY KEY (produit_id, tax_id),
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE,
    FOREIGN KEY (tax_id) REFERENCES taxes(id) ON DELETE CASCADE
);

CREATE TABLE variation_taxes (
    variation_id INTEGER,
    tax_id INTEGER,
    PRIMARY KEY (variation_id, tax_id),
    FOREIGN KEY (variation_id) REFERENCES produit_variations(id) ON DELETE CASCADE,
    FOREIGN KEY (tax_id) REFERENCES taxes(id) ON DELETE CASCADE
);

CREATE TABLE variation_attributs (
    variation_id INTEGER,
    attribut_id INTEGER,
    PRIMARY KEY (variation_id, attribut_id),
    FOREIGN KEY (variation_id) REFERENCES produit_variations(id) ON DELETE CASCADE,
    FOREIGN KEY (attribut_id) REFERENCES attributs(id) ON DELETE CASCADE
);

CREATE TABLE variation_couleurs (
    variation_id INTEGER,
    couleur_id INTEGER,
    PRIMARY KEY (variation_id, couleur_id),
    FOREIGN KEY (variation_id) REFERENCES produit_variations(id) ON DELETE CASCADE,
    FOREIGN KEY (couleur_id) REFERENCES couleurs(id) ON DELETE CASCADE
);

-- =========================
-- BONS DE COMMANDE
-- =========================
CREATE TABLE bons_commande (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fournisseur_id INTEGER,
    date_commande TEXT NOT NULL,
    reduction_type TEXT CHECK(reduction_type IN ('percentage','substraction')),
    reduction_valeur REAL DEFAULT 0,
    FOREIGN KEY (fournisseur_id) REFERENCES fournisseurs(id) ON DELETE SET NULL
);

-- PRODUITS DANS UN BON DE COMMANDE
CREATE TABLE bon_commande_produits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bon_id INTEGER NOT NULL,
    produit_id INTEGER,
    variation_id INTEGER,
    quantite INTEGER NOT NULL,
    prix_achat REAL NOT NULL,
    prix_achat_ttc REAL NOT NULL,
    FOREIGN KEY (bon_id) REFERENCES bons_commande(id) ON DELETE CASCADE,
    FOREIGN KEY (produit_id) REFERENCES produits(id),
    FOREIGN KEY (variation_id) REFERENCES produit_variations(id)
);

-- FRAIS POUR UN BON DE COMMANDE
CREATE TABLE bon_commande_frais (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bon_id INTEGER NOT NULL,
    nom TEXT NOT NULL,
    montant REAL NOT NULL,
    FOREIGN KEY (bon_id) REFERENCES bons_commande(id) ON DELETE CASCADE
);

-- =========================
-- BONS DE RECEPTION
-- =========================
CREATE TABLE bons_reception (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bon_commande_id INTEGER,
    livreur_nom TEXT,
    date_reception TEXT NOT NULL,
    FOREIGN KEY (bon_commande_id) REFERENCES bons_commande(id) ON DELETE SET NULL
);

-- PRODUITS DANS UN BON DE RECEPTION
CREATE TABLE bon_reception_produits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bon_reception_id INTEGER NOT NULL,
    produit_id INTEGER,
    variation_id INTEGER,
    quantite INTEGER NOT NULL,
    FOREIGN KEY (bon_reception_id) REFERENCES bons_reception(id) ON DELETE CASCADE,
    FOREIGN KEY (produit_id) REFERENCES produits(id),
    FOREIGN KEY (variation_id) REFERENCES produit_variations(id)
);

  `);

    return db;
};

