export const createBrandQuery = `
  INSERT INTO brands (nom) VALUES (?)
`;

export const getBrandByIdQuery = `
  SELECT * FROM brands WHERE id = ?
`;

export const getAllBrandsQuery = `
  SELECT * FROM brands
`;

export const updateBrandQuery = `
  UPDATE brands SET nom = ? WHERE id = ?
`;

export const deleteBrandQuery = `
  DELETE FROM brands WHERE id = ?
`;
