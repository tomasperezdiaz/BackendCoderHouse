import { UserDao } from "../dao/index.js";

export const getUserById = async (id) => await UserDao.getUserById(id);
export const getUserEmail = async (email) => await UserDao.getUserEmail(email);
export const registerUser = async (user) => await UserDao.registerUser(user);
