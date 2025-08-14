import { initDB } from "../connection";
import {
  createUserQuery,
  getUserByIdQuery,
  getAllUsersQuery,
  updateUserQuery,
  deleteUserQuery,
  getUserByUsernameQuery,
  getUserByEmailQuery,
} from "./users.queries";

export const createUser = async (
  nom: string,
  prenom: string,
  username: string,
  email: string,
  password: string,
  tel1: string,
  tel2: string,
  role: string,
  is_admin: number = 0
) => {
  const db = await initDB();
  const result = await db.run(createUserQuery, [
    nom,
    prenom,
    username,
    email,
    password,
    tel1,
    tel2,
    role,
    is_admin,
  ]);
  return result.lastID;
};

export const getUserById = async (id: number) => {
  const db = await initDB();
  const result = await db.get(getUserByIdQuery, [id]);
  return result;
};

export const getAllUsers = async () => {
  const db = await initDB();
  const result = await db.all(getAllUsersQuery);
  return result;
};

export const updateUser = async (
  id: number,
  nom: string,
  prenom: string,
  username: string,
  email: string,
  password: string,
  tel1: string,
  tel2: string,
  role: string,
  is_admin: number
) => {
  const db = await initDB();
  const result = await db.run(updateUserQuery, [
    nom,
    prenom,
    username,
    email,
    password,
    tel1,
    tel2,
    role,
    is_admin,
    id,
  ]);
  return result.changes > 0;
};

export const deleteUser = async (id: number) => {
  const db = await initDB();
  const result = await db.run(deleteUserQuery, [id]);
  return result.changes > 0;
};

export const getUserByUsername = async (username: string) => {
  const db = await initDB();
  const result = await db.get(getUserByUsernameQuery, [username]);
  return result;
};

export const getUserByEmail = async (email: string) => {
  const db = await initDB();
  const result = await db.get(getUserByEmailQuery, [email]);
  return result;
};
