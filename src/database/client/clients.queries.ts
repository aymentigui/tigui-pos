export const createClientQuery = `
  INSERT INTO clients (nom, prenom, email, tel1, tel2, adresse) 
  VALUES (?, ?, ?, ?, ?, ?)
`;

export const getClientByIdQuery = `
  SELECT * FROM clients WHERE id = ?
`;

export const getAllClientsQuery = `
  SELECT * FROM clients
`;

export const updateClientQuery = `
  UPDATE clients 
  SET nom = ?, prenom = ?, email = ?, tel1 = ?, tel2 = ?, adresse = ? 
  WHERE id = ?
`;

export const deleteClientQuery = `
  DELETE FROM clients WHERE id = ?
`;
