import { initDB } from "../connection";
import { createUserQuery, getAllUsersQuery, getUserByIdQuery } from "./users.queries";

export const createUser = async (username: string, password: string) => {
  const db = await initDB();
  const result = await db.run(createUserQuery, [username, password]);
  return result.lastID;
};

export const getUserById = async (id: number) => {
  const db = await initDB();
  return await db.get(getUserByIdQuery, [id]);
};

export const getAllUsers = async () => {
  const db = await initDB();
  return await db.all(getAllUsersQuery);
};
