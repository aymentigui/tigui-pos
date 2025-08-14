export const createTaxQuery = `
  INSERT INTO taxes (nom, valeur, type) VALUES (?, ?, ?)
`;

export const getTaxByIdQuery = `
  SELECT * FROM taxes WHERE id = ?
`;

export const getAllTaxesQuery = `
  SELECT * FROM taxes
`;

export const updateTaxQuery = `
  UPDATE taxes SET nom = ?, valeur = ?, type = ? WHERE id = ?
`;

export const deleteTaxQuery = `
  DELETE FROM taxes WHERE id = ?
`;
