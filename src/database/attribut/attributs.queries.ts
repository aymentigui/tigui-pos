// =====================
// ATTRIBUTS
// =====================
export const createAttributQuery = `
  INSERT INTO attributs (nom) VALUES (?)
`;

export const getAttributByIdQuery = `
  SELECT * FROM attributs WHERE id = ?
`;

export const getAllAttributsQuery = `
  SELECT * FROM attributs
`;

export const updateAttributQuery = `
  UPDATE attributs SET nom = ? WHERE id = ?
`;

export const deleteAttributQuery = `
  DELETE FROM attributs WHERE id = ?
`;

// =====================
// VALEURS D’ATTRIBUTS
// =====================
export const createAttributValueQuery = `
  INSERT INTO attribut_valeurs (attribut_id, valeur) VALUES (?, ?)
`;

export const getAttributValuesByAttributIdQuery = `
  SELECT * FROM attribut_valeurs WHERE attribut_id = ?
`;

export const deleteAttributValueQuery = `
  DELETE FROM attribut_valeurs WHERE id = ?
`;
