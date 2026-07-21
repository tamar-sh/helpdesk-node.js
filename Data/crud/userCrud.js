import User from "../models/usersModels.js";

export const createUserAsync = async (userData) => {
  const user = new User(userData);
  return await user.save();
};
export const getAllUsersAsync = async (filter = {}) => {
  return await User.find(filter);
};
export const getUserByIdAsync = async (userId) => {
  return await User.findById(userId);
};
export const getUserByEmailAsync = async (email) => {
  return await User.findOne({ email });
};
export const updateUserAsync = async (userId, updatedData) => {
  return await User.findByIdAndUpdate(userId, updatedData, { new: true });
};
export const deleteUserAsync = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

 