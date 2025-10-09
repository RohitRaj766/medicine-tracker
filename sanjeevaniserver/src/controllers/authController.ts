import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse, LoginRequest, RegisterRequest } from '../types';
import { AuthService } from '../services/authService';

export class AuthController {
  static async register(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const data: RegisterRequest = req.body;
      const result = await AuthService.register(data);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed',
        error: 'REGISTRATION_ERROR'
      });
    }
  }

  static async login(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const data: LoginRequest = req.body;
      const result = await AuthService.login(data);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed',
        error: 'LOGIN_ERROR'
      });
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const user = await AuthService.getUserById(req.user!.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          error: 'USER_NOT_FOUND'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLoginAt: user.lastLoginAt
        }
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve profile',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const { displayName, photoURL } = req.body;
      const userId = req.user!.id;

      // Update user profile
      const updatedUser = await AuthService.getUserById(userId);
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          error: 'USER_NOT_FOUND'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          displayName: updatedUser.displayName,
          photoURL: updatedUser.photoURL,
          emailVerified: updatedUser.emailVerified,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
          lastLoginAt: updatedUser.lastLoginAt
        }
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }
}
