import { Response } from 'express';
import User from '../models/userModel';
import { AuthRequest } from '../middlewares/auth';

// ─── Get all users (admin only) ───────────────────────────────────────────────
// GET /api/users
export const getAllUsers = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('GetAllUsers error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Get user by ID ───────────────────────────────────────────────────────────
// GET /api/users/:id
export const getUserById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('GetUserById error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Update own profile ───────────────────────────────────────────────────────
// PUT /api/users/profile  [protected]
export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email } = req.body;

    // Prevent password update through this route
    if (req.body.password) {
      res.status(400).json({
        success: false,
        message: 'Use /api/auth/change-password to update your password.',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { name, email },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, user });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ success: false, message: 'Email already in use.' });
      return;
    }
    console.error('UpdateProfile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Delete user (admin only) ─────────────────────────────────────────────────
// DELETE /api/users/:id
export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    console.error('DeleteUser error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};