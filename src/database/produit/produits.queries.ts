// =========================
// PRODUITS
// =========================
export const createProduitQuery = `
  INSERT INTO produits (nom, code_barre, type, prix_achat, prix_achat_ttc, prix_vente, quantite_stock, image, actif)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

export const getProduitByIdQuery = `
  SELECT * FROM produits WHERE id = ?
`;

export const getAllProduitsQuery = `
  SELECT * FROM produits
`;

export const updateProduitQuery = `
  UPDATE produits
  SET nom = ?, code_barre = ?, type = ?, prix_achat = ?, prix_achat_ttc = ?, prix_vente = ?, quantite_stock = ?, image = ?, actif = ?
  WHERE id = ?
`;

export const deleteProduitQuery = `
  DELETE FROM produits WHERE id = ?
`;

// =========================
// VARIATIONS
// =========================
export const createVariationQuery = `
  INSERT INTO produit_variations (produit_id, nom, prix_achat, prix_achat_ttc, prix_vente, quantite_stock, image, actif)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

export const getVariationsByProduitQuery = `
  SELECT * FROM produit_variations WHERE produit_id = ?
`;

export const updateVariationQuery = `
  UPDATE produit_variations
  SET nom = ?, prix_achat = ?, prix_achat_ttc = ?, prix_vente = ?, quantite_stock = ?, image = ?, actif = ?
  WHERE id = ?
`;

export const deleteVariationQuery = `
  DELETE FROM produit_variations WHERE id = ?
`;

// =========================
// RELATIONS
// =========================
export const addProduitCategorieQuery = `
  INSERT INTO produit_categories (produit_id, categorie_id) VALUES (?, ?)
`;

export const addProduitBrandQuery = `
  INSERT INTO produit_brands (produit_id, brand_id) VALUES (?, ?)
`;

export const addProduitTaxQuery = `
  INSERT INTO produit_taxes (produit_id, tax_id) VALUES (?, ?)
`;

export const addVariationTaxQuery = `
  INSERT INTO variation_taxes (variation_id, tax_id) VALUES (?, ?)
`;

export const addVariationAttributQuery = `
  INSERT INTO variation_attributs (variation_id, attribut_id) VALUES (?, ?)
`;

export const addVariationCouleurQuery = `
  INSERT INTO variation_couleurs (variation_id, couleur_id) VALUES (?, ?)
`;
