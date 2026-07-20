import asyncHandler from '../Middleware/asyncHandler.js';
import { createUser, loginUser } from '../Services/authService.js';

export const register = asyncHandler(async (req, res) => {
  const newUser = await createUser(req.body);
  const { password, ...safeUser } = newUser.toObject();
  res.status(201).json({ success: true, data: safeUser });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);   
  res.status(200).json({ success: true, token: result.token, data: result.user });
});
