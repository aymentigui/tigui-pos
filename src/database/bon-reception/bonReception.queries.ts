// === Bons de réception ===
export const createBonReceptionQuery = `
  INSERT INTO bons_reception (bon_commande_id, livreur_nom, date_reception)
  VALUES (?, ?, ?)
`;

export const getBonReceptionByIdQuery = `
  SELECT * FROM bons_reception WHERE id = ?
`;

export const getAllBonReceptionsQuery = `
  SELECT * FROM bons_reception
`;

export const updateBonReceptionQuery = `
  UPDATE bons_reception
  SET bon_commande_id = ?, livreur_nom = ?, date_reception = ?
  WHERE id = ?
`;

export const deleteBonReceptionQuery = `
  DELETE FROM bons_reception WHERE id = ?
`;

// === Produits d’un bon de réception ===
export const createBonReceptionProduitQuery = `
  INSERT INTO bon_reception_produits (bon_reception_id, produit_id, variation_id, quantite)
  VALUES (?, ?, ?, ?)
`;

export const deleteProduitsByBonReceptionIdQuery = `
  DELETE FROM bon_reception_produits WHERE bon_reception_id = ?
`;
