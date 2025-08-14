export const createUserQuery = `
  INSERT INTO users (username, password) VALUES (?, ?)
`;

export const getUserByIdQuery = `
  SELECT * FROM users WHERE id = ?
`;

export const getAllUsersQuery = `
  SELECT * FROM users
`;

export const deleteUserQuery = `
  DELETE FROM users WHERE id = ?
`;
