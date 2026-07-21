import {createUserByAdmin,getAllUsersServiceAsync,getUserByIdServiceAsync,updateUserByIdServiceAsync,deleteUserByIdServiceAsync} from "../Services/userService.js";
import asyncHandler from '../Middleware/asyncHandler.js';
import AppError from '../Middleware/appError.js';

export const createUserController = asyncHandler(async (req, res, next) => {
    const user = await createUserByAdmin(req.body);
    const { password, ...safeUser } = user.toObject();
    res.status(201).json({ success: true, data: safeUser });
});

export const getAllUsersController = asyncHandler(async (req, res, next) => {
    const users = await getAllUsersServiceAsync();
    const safeUsers = users.map(user => {
    const { password, ...safeUser } = user.toObject();
    return safeUser;});

    res.status(200).json({ success: true, data: safeUsers });
});

export const getUserByIdController = asyncHandler(async (req, res, next) => {
    const user = await getUserByIdServiceAsync(req.params.id);
    const { password, ...safeUser } = user.toObject();
    res.status(200).json({ success: true, data: safeUser });
});

export const updateUserByIdController = asyncHandler(async (req, res, next) => {
    if (!req.params.id) {
        return next(new AppError("User ID is required", 400));
    }
    const updatedUser = await updateUserByIdServiceAsync(req.params.id, req.body);
    const { password, ...safeUser } = updatedUser.toObject();
    res.status(200).json({ success: true, data: safeUser });
});

export const deleteUserByIdController = asyncHandler(async (req, res, next) => {
    if (!req.params.id) {
        return next(new AppError("User ID is required", 400));
    }   
    const result = await deleteUserByIdServiceAsync(req.params.id);
    res.status(200).json({ success: true, data: result });
});

