import jwt from 'jsonwebtoken';
import { prisma } from '../lib/database';
import { User, MedicineStatus } from '../types';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types';

export class AuthService {
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        displayName: data.displayName,
        photoURL: data.photoURL,
        emailVerified: true, // For now, assume social login is verified
        lastLoginAt: new Date()
      }
    });

    // Generate JWT token
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt
      },
      token
    };
  }

  static async login(data: LoginRequest): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate JWT token
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt
      },
      token
    };
  }

  static async getUserById(userId: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id: userId }
    });
  }

  static generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign(
      { userId },
      secret,
      { expiresIn: '7d' }
    );
  }

  static verifyToken(token: string): { userId: string } {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  }
}
