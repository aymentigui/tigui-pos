export const createCategoryQuery = `
  INSERT INTO categories (nom, parent_id) VALUES (?, ?)
`;

export const getCategoryByIdQuery = `
  SELECT * FROM categories WHERE id = ?
`;

export const getAllCategoriesQuery = `
  SELECT * FROM categories
`;

export const updateCategoryQuery = `
  UPDATE categories SET nom = ?, parent_id = ? WHERE id = ?
`;

export const deleteCategoryQuery = `
  DELETE FROM categories WHERE id = ?
`;
