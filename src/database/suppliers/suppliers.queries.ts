export const createFournisseurQuery = `
  INSERT INTO fournisseurs (nom, prenom, societe, email, tel1, tel2, adresse)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

export const getFournisseurByIdQuery = `
  SELECT * FROM fournisseurs WHERE id = ?
`;

export const getAllFournisseursQuery = `
  SELECT * FROM fournisseurs
`;

export const updateFournisseurQuery = `
  UPDATE fournisseurs
  SET nom = ?, prenom = ?, societe = ?, email = ?, tel1 = ?, tel2 = ?, adresse = ?
  WHERE id = ?
`;

export const deleteFournisseurQuery = `
  DELETE FROM fournisseurs WHERE id = ?
`;
