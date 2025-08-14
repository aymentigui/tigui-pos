export const createCategoryQuery = `
  INSERT INTO categories (name, description) VALUES (?, ?)
`;

export const getCategoryByIdQuery = `
  SELECT * FROM categories WHERE id = ?
`;

export const getAllCategoriesQuery = `
  SELECT * FROM categories
`;

export const updateCategoryQuery = `
  UPDATE categories SET name = ?, description = ? WHERE id = ?
`;

export const deleteCategoryQuery = `
  DELETE FROM categories WHERE id = ?
`;