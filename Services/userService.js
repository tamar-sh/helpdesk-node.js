import bcryptjs from "bcryptjs";
import { createUserAsync,getAllUsersAsync,getUserByIdAsync,updateUserAsync,deleteUserAsync } from "../Data/crud/userCrud.js";
import AppError from "../Middleware/appError.js";

export const createUserByAdmin = async (userData) => {
    const userToCreate = {
        name: userData.name,
        email: userData.email,
        password: await bcryptjs.hash(userData.password, 12),
        role: userData.role, 
        phone: userData.phone,
        avatar: userData.avatar || "default-avatar.png"
        };
          return await createUserAsync(userToCreate);
    }

export const getAllUsersServiceAsync = async () => {
    const users = await getAllUsersAsync();
    return users;
};

export const getUserByIdServiceAsync = async (userId) => {
    const user = await getUserByIdAsync(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return user;
};


export const updateUserByIdServiceAsync = async (userId, updatedData) => {
    const user = await getUserByIdAsync(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    if (updatedData.password) {
        updatedData.password = await bcryptjs.hash(updatedData.password, 12);
    }
    const updatedUser = await updateUserAsync(userId, updatedData);
    return updatedUser;
};

export const deleteUserByIdServiceAsync = async (userId) => {
    const user = await getUserByIdAsync(userId);    
    if (!user) {
        throw new AppError("User not found", 404);
    }
    await deleteUserAsync(userId);
    return { message: "User deleted successfully" };
};

