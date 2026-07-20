import bcryptjs from 'bcryptjs';
import { createUserAsync,getUserByEmailAsync } from '../Data/crud/userCrud.js';
import AppError from '../Middleware/appError.js';
import jwt from 'jsonwebtoken';

export const createUser = async (userData) => {
  const userToCreate = {
   name: userData.name,
   email: userData.email,
   password: await bcryptjs.hash(userData.password, 12),
   role: 'employee', // כפייה של הערך הנכון
   phone: userData.phone,
   avatar: userData.avatar || "default-avatar.png"
  };
  
  return await createUserAsync(userToCreate);
};

export const loginUser = async (email, password) => {
  const user = await getUserByEmailAsync(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const payload = {
    id: user._id,
    role: user.role
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  return { token, user: userResponse };
}

