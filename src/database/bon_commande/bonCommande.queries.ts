// === Bons de commande ===
export const createBonCommandeQuery = `
  INSERT INTO bons_commande (fournisseur_id, date_commande, reduction_type, reduction_valeur)
  VALUES (?, ?, ?, ?)
`;

export const getBonCommandeByIdQuery = `
  SELECT * FROM bons_commande WHERE id = ?
`;

export const getAllBonCommandesQuery = `
  SELECT * FROM bons_commande
`;

export const updateBonCommandeQuery = `
  UPDATE bons_commande
  SET fournisseur_id = ?, date_commande = ?, reduction_type = ?, reduction_valeur = ?
  WHERE id = ?
`;

export const deleteBonCommandeQuery = `
  DELETE FROM bons_commande WHERE id = ?
`;

// === Produits d’un bon de commande ===
export const createBonCommandeProduitQuery = `
  INSERT INTO bon_commande_produits (bon_id, produit_id, variation_id, quantite, prix_achat, prix_achat_ttc)
  VALUES (?, ?, ?, ?, ?, ?)
`;

export const deleteProduitsByBonIdQuery = `
  DELETE FROM bon_commande_produits WHERE bon_id = ?
`;

// === Frais d’un bon de commande ===
export const createBonCommandeFraisQuery = `
  INSERT INTO bon_commande_frais (bon_id, nom, montant)
  VALUES (?, ?, ?)
`;

export const deleteFraisByBonIdQuery = `
  DELETE FROM bon_commande_frais WHERE bon_id = ?
`;
