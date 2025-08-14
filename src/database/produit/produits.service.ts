import { initDB } from "../connection";
import {
  createProduitQuery,
  getProduitByIdQuery,
  getAllProduitsQuery,
  updateProduitQuery,
  deleteProduitQuery,
  createVariationQuery,
  getVariationsByProduitQuery,
  addProduitCategorieQuery,
  addProduitBrandQuery,
  addProduitTaxQuery,
  addVariationTaxQuery,
  addVariationAttributQuery,
  addVariationCouleurQuery,
} from "./produits.queries";

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
    prix_achat_ttc,
    prix_vente,
    quantite_stock,
    image,
    actif,
    categories,
    brands,
    taxes,
    variations,
  } = data;

  const result = await db.run(createProduitQuery, [
    nom,
    code_barre,
    type,
    prix_achat,
    prix_achat_ttc,
    prix_vente,
    quantite_stock,
    image,
    actif ?? 1,
  ]);

  const produitId = result.lastID;

  // Catégories
  if (categories && Array.isArray(categories)) {
    for (const catId of categories) {
      await db.run(addProduitCategorieQuery, [produitId, catId]);
    }
  }

  // Marques
  if (brands && Array.isArray(brands)) {
    for (const brandId of brands) {
      await db.run(addProduitBrandQuery, [produitId, brandId]);
    }
  }

  // Taxes
  if (taxes && Array.isArray(taxes)) {
    for (const taxId of taxes) {
      await db.run(addProduitTaxQuery, [produitId, taxId]);
    }
  }

  // Variations
  if (variations && Array.isArray(variations)) {
    for (const variation of variations) {
      const resultVar = await db.run(createVariationQuery, [
        produitId,
        variation.nom,
        variation.prix_achat,
        variation.prix_achat_ttc,
        variation.prix_vente,
        variation.quantite_stock,
        variation.image,
        variation.actif ?? 1,
      ]);

      const variationId = resultVar.lastID;

      // Taxes pour variation
      if (variation.taxes) {
        for (const taxId of variation.taxes) {
          await db.run(addVariationTaxQuery, [variationId, taxId]);
        }
      }

      // Attributs pour variation
      if (variation.attributs) {
        for (const attrId of variation.attributs) {
          await db.run(addVariationAttributQuery, [variationId, attrId]);
        }
      }

      // Couleurs pour variation
      if (variation.couleurs) {
        for (const couleurId of variation.couleurs) {
          await db.run(addVariationCouleurQuery, [variationId, couleurId]);
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
  const produit = await db.get(getProduitByIdQuery, [id]);

  if (!produit) return null;

  // Récupérer les variations
  const variations = await db.all(getVariationsByProduitQuery, [id]);
  produit.variations = variations;

  return produit;
};

// =========================
// GET ALL PRODUITS
// =========================
export const getAllProduits = async () => {
  const db = await initDB();
  return await db.all(getAllProduitsQuery);
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
    prix_achat_ttc,
    prix_vente,
    quantite_stock,
    image,
    actif,
    categories,
    brands,
    taxes,
    variations,
  } = data;

  await db.run(updateProduitQuery, [
    nom,
    code_barre,
    type,
    prix_achat,
    prix_achat_ttc,
    prix_vente,
    quantite_stock,
    image,
    actif,
    id,
  ]);

  // On simplifie : supprimer puis recréer les relations
  await db.run(`DELETE FROM produit_categories WHERE produit_id = ?`, [id]);
  await db.run(`DELETE FROM produit_brands WHERE produit_id = ?`, [id]);
  await db.run(`DELETE FROM produit_taxes WHERE produit_id = ?`, [id]);
  await db.run(`DELETE FROM produit_variations WHERE produit_id = ?`, [id]);

  // Recréer les relations
  if (categories) {
    for (const catId of categories) {
      await db.run(addProduitCategorieQuery, [id, catId]);
    }
  }

  if (brands) {
    for (const brandId of brands) {
      await db.run(addProduitBrandQuery, [id, brandId]);
    }
  }

  if (taxes) {
    for (const taxId of taxes) {
      await db.run(addProduitTaxQuery, [id, taxId]);
    }
  }

  if (variations) {
    for (const variation of variations) {
      const resultVar = await db.run(createVariationQuery, [
        id,
        variation.nom,
        variation.prix_achat,
        variation.prix_achat_ttc,
        variation.prix_vente,
        variation.quantite_stock,
        variation.image,
        variation.actif ?? 1,
      ]);

      const variationId = resultVar.lastID;

      if (variation.taxes) {
        for (const taxId of variation.taxes) {
          await db.run(addVariationTaxQuery, [variationId, taxId]);
        }
      }

      if (variation.attributs) {
        for (const attrId of variation.attributs) {
          await db.run(addVariationAttributQuery, [variationId, attrId]);
        }
      }

      if (variation.couleurs) {
        for (const couleurId of variation.couleurs) {
          await db.run(addVariationCouleurQuery, [variationId, couleurId]);
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
  await db.run(deleteProduitQuery, [id]);
  return true;
};

// =========================
// GET VARIATION BY ID
// =========================
export const getVariationById = async (id: number) => {
  const db = await initDB();
  return await db.get(`SELECT * FROM produit_variations WHERE id = ?`, [id]);
};
