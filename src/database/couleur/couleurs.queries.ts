export const createCouleurQuery = `
  INSERT INTO couleurs (nom, valeur) VALUES (?, ?)
`;

export const getCouleurByIdQuery = `
  SELECT * FROM couleurs WHERE id = ?
`;

export const getAllCouleursQuery = `
  SELECT * FROM couleurs
`;

export const updateCouleurQuery = `
  UPDATE couleurs SET nom = ?, valeur = ? WHERE id = ?
`;

export const deleteCouleurQuery = `
  DELETE FROM couleurs WHERE id = ?
`;
