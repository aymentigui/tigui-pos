import { initDB } from "./connection";

// =========================
// CREATE PRODUIT
// =========================
export const createProduit = async (data: any) => {
  const db = await initDB();
  const {
    nom,
    code_barre,
    type,
    prix_achat,
    prix_vente,
    quantite_stock,
    image,
    actif,
    categories,
    brands,
    taxes,
    variations,
  } = data;

  let total_price = await calcul_price_ttc(taxes, db, prix_achat);

  const result = await db.run(
    `INSERT INTO produits (nom, code_barre, type, prix_achat, prix_achat_ttc, prix_vente, quantite_stock, image, actif)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nom, code_barre, type, prix_achat, total_price, prix_vente, quantite_stock, image, actif ?? 1]
  );

  const produitId = result.lastID;

  // Relations
  if (categories) {
    for (const catId of categories) {
      await db.run(`INSERT INTO produit_categories (produit_id, categorie_id) VALUES (?, ?)`, [produitId, catId]);
    }
  }

  if (brands) {
    for (const brandId of brands) {
      await db.run(`INSERT INTO produit_brands (produit_id, brand_id) VALUES (?, ?)`, [produitId, brandId]);
    }
  }

  if (taxes) {
    for (const taxId of taxes) {
      await db.run(`INSERT INTO produit_taxes (produit_id, tax_id) VALUES (?, ?)`, [produitId, taxId]);
    }
  }

  // Variations
  if (variations) {
    for (const variation of variations) {
      let total_price = await calcul_price_ttc(taxes, db, variation.prix_achat);

      const resultVar = await db.run(
        `INSERT INTO produit_variations (produit_id, nom, prix_achat, prix_achat_ttc, prix_vente, code_barre, quantite_stock, image, actif)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          produitId,
          variation.nom,
          variation.prix_achat,
          total_price,
          variation.prix_vente,
          variation.code_barre,
          variation.quantite_stock,
          variation.image,
          variation.actif ?? 1,
        ]
      );

      const variationId = resultVar.lastID;

      if (variation.attributs) {
        for (const attrId of variation.attributs) {
          await db.run(`INSERT INTO variation_attributs (variation_id, attribut_id) VALUES (?, ?)`, [variationId, attrId]);
        }
      }

      if (variation.couleurs) {
        for (const couleurId of variation.couleurs) {
          await db.run(`INSERT INTO variation_couleurs (variation_id, couleur_id) VALUES (?, ?)`, [variationId, couleurId]);
        }
      }
    }
  }

  return produitId;
};

// =========================
// GET PRODUIT BY ID
// =========================
export const getProduitById = async (id: number) => {
  const db = await initDB();
  const produit = await db.get(`SELECT * FROM produits WHERE id = ?`, [id]);

  if (!produit) return null;

  const variations = await db.all(`SELECT * FROM produit_variations WHERE produit_id = ?`, [id]);
  produit.variations = variations;

  return produit;
};

// =========================
// GET ALL PRODUITS
// =========================
export const getAllProduits = async () => {
  const db = await initDB();
  const products = await db.all(`SELECT * FROM produits`);
  const variations = await db.all(`SELECT * FROM produit_variations`);

  products.forEach((product: any) => {
    product.variations_name = variations
      .filter((v: any) => v.produit_id === product.id)
      .map((v: any) => v.nom)
      .join(" | ");
    product.variations_prix_vente = variations
      .filter((v: any) => v.produit_id === product.id)
      .map((v: any) => v.prix_vente)
      .join(" | ");
    product.variations_prix_achat = variations
      .filter((v: any) => v.produit_id === product.id)
      .map((v: any) => v.prix_achat)
      .join(" | ");
    product.variations_quantite_stock = variations
      .filter((v: any) => v.produit_id === product.id)
      .map((v: any) => v.quantite_stock)
      .join(" | ");
  });

  return products;
};

// =========================
// UPDATE PRODUIT
// =========================
export const updateProduit = async (id: number, data: any) => {
  const db = await initDB();
  const {
    nom,
    code_barre,
    type,
    prix_achat,
    prix_vente,
    quantite_stock,
    image,
    actif,
    categories,
    brands,
    taxes,
    variations,
  } = data;

  let total_price = await calcul_price_ttc(taxes, db, prix_achat);

  await db.run(
    `UPDATE produits SET nom = ?, code_barre = ?, type = ?, prix_achat = ?, prix_achat_ttc = ?, prix_vente = ?, quantite_stock = ?, image = ?, actif = ?
     WHERE id = ?`,
    [nom, code_barre, type, prix_achat, total_price, prix_vente, quantite_stock, image, actif, id]
  );

  // Supprimer les relations avant de recréer
  await db.run(`DELETE FROM produit_categories WHERE produit_id = ?`, [id]);
  await db.run(`DELETE FROM produit_brands WHERE produit_id = ?`, [id]);
  await db.run(`DELETE FROM produit_taxes WHERE produit_id = ?`, [id]);
  await db.run(`DELETE FROM produit_variations WHERE produit_id = ?`, [id]);

  // Recréer les relations
  if (categories) {
    for (const catId of categories) {
      await db.run(`INSERT INTO produit_categories (produit_id, categorie_id) VALUES (?, ?)`, [id, catId]);
    }
  }

  if (brands) {
    for (const brandId of brands) {
      await db.run(`INSERT INTO produit_brands (produit_id, brand_id) VALUES (?, ?)`, [id, brandId]);
    }
  }

  if (taxes) {
    for (const taxId of taxes) {
      await db.run(`INSERT INTO produit_taxes (produit_id, tax_id) VALUES (?, ?)`, [id, taxId]);
    }
  }

  if (variations) {
    for (const variation of variations) {
      let total_price = await calcul_price_ttc(taxes, db, variation.prix_achat);

      const resultVar = await db.run(
        `INSERT INTO produit_variations (produit_id, nom, prix_achat, prix_achat_ttc, prix_vente, code_barre, quantite_stock, image, actif)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          variation.nom,
          variation.prix_achat,
          total_price,
          variation.prix_vente,
          variation.code_barre,
          variation.quantite_stock,
          variation.image,
          variation.actif ?? 1,
        ]
      );

      const variationId = resultVar.lastID;

      if (variation.attributs) {
        for (const attrId of variation.attributs) {
          await db.run(`INSERT INTO variation_attributs (variation_id, attribut_id) VALUES (?, ?)`, [variationId, attrId]);
        }
      }

      if (variation.couleurs) {
        for (const couleurId of variation.couleurs) {
          await db.run(`INSERT INTO variation_couleurs (variation_id, couleur_id) VALUES (?, ?)`, [variationId, couleurId]);
        }
      }
    }
  }

  return true;
};

// =========================
// DELETE PRODUIT
// =========================
export const deleteProduit = async (id: number) => {
  const db = await initDB();
  await db.run(`DELETE FROM produits WHERE id = ?`, [id]);
  return true;
};

// =========================
// VARIATIONS HELPERS
// =========================
export const getVariationById = async (id: number) => {
  const db = await initDB();
  return db.get(`SELECT * FROM produit_variations WHERE id = ?`, [id]);
};

export const getAllVariationByProductId = async (productId: number) => {
  const db = await initDB();
  return db.all(`SELECT * FROM produit_variations WHERE produit_id = ?`, [productId]);
};

export const getAllCategoriesByProductId = async (productId: number) => {
  const db = await initDB();
  return db.all(`SELECT * FROM produit_categories WHERE produit_id = ?`, [productId]);
};

export const getAllBrandsByProductId = async (productId: number) => {
  const db = await initDB();
  return db.all(`SELECT * FROM produit_brands WHERE produit_id = ?`, [productId]);
};

export const getAllTaxesByProductId = async (productId: number) => {
  const db = await initDB();
  return db.all(`SELECT * FROM produit_taxes WHERE produit_id = ?`, [productId]);
};

// =========================
// CALCUL TTC
// =========================
const calcul_price_ttc = async (taxes: any[], db: any, prix_achat: any) => {
  let total_price = prix_achat;
  if (taxes && Array.isArray(taxes)) {
    const taxesWithValues = await db.all("SELECT * FROM taxes");

    if (taxesWithValues.length > 0) {
      let taxesPourcentage: number[] = [];
      let taxesAddition: number[] = [];

      for (const { type, valeur } of taxesWithValues) {
        if (type === "percentage") {
          taxesPourcentage.push(parseFloat(valeur));
        } else if (type === "addition") {
          taxesAddition.push(parseFloat(valeur));
        }
      }

      let totalPourcentage = total_price;
      for (const p of taxesPourcentage) {
        totalPourcentage += (totalPourcentage * p) / 100;
      }

      let totalFinal = totalPourcentage;
      for (const a of taxesAddition) {
        totalFinal += a;
      }

      total_price = totalFinal;
    }
  }
  return total_price;
};
