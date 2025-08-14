export const createUserQuery = `
  INSERT INTO users (nom, prenom, username, email, password, tel1, tel2, role, is_admin)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

export const getUserByIdQuery = `
  SELECT * FROM users WHERE id = ?
`;

export const getAllUsersQuery = `
  SELECT * FROM users
`;

export const updateUserQuery = `
  UPDATE users
  SET nom = ?, prenom = ?, username = ?, email = ?, password = ?, tel1 = ?, tel2 = ?, role = ?, is_admin = ?
  WHERE id = ?
`;

export const deleteUserQuery = `
  DELETE FROM users WHERE id = ?
`;

export const getUserByUsernameQuery = `
  SELECT * FROM users WHERE username = ?
`;

export const getUserByEmailQuery = `
  SELECT * FROM users WHERE email = ?
`;
