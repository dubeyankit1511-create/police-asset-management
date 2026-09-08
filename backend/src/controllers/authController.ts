import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../index';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_police_key';

// ─── HARDCODED SUPER ADMINISTRATOR ─────────────────────────────────────────
// This account exists outside the database. It cannot be deleted or modified.
const SUPER_ADMIN = {
  id: 'SUPER-ADMIN-001',
  email: 'admin@securesync.gov',
  badgeNumber: 'SA-0001',
  passwordHash: '$2b$10$placeholder', // Will be compared at runtime
  rawPassword: 'SuperAdmin@2024',
  firstName: 'Super',
  lastName: 'Administrator',
  role: 'ADMIN' as const,
  department: 'Central Command',
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, badgeNumber, department, role } = req.body;

    // Block registration with super admin credentials
    if (badgeNumber === SUPER_ADMIN.badgeNumber || email === SUPER_ADMIN.email) {
      return res.status(403).json({ error: 'This identity is reserved by the system.' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { badgeNumber }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or badge number already exists.' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        badgeNumber,
        department,
        role: role || 'OFFICER'
      }
    });

    res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: newUser.id,
        email: newUser.email,
        badgeNumber: newUser.badgeNumber,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { badgeNumber, password } = req.body;

    // ─── CHECK SUPER ADMIN FIRST ──────────────────────────────────────
    if (badgeNumber === SUPER_ADMIN.badgeNumber && password === SUPER_ADMIN.rawPassword) {
      const token = jwt.sign(
        { userId: SUPER_ADMIN.id, role: SUPER_ADMIN.role },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      return res.status(200).json({
        message: 'Super Administrator authenticated.',
        token,
        user: {
          id: SUPER_ADMIN.id,
          firstName: SUPER_ADMIN.firstName,
          lastName: SUPER_ADMIN.lastName,
          role: SUPER_ADMIN.role,
          department: SUPER_ADMIN.department,
          badge: SUPER_ADMIN.badgeNumber,
          isSuperAdmin: true,
        }
      });
    }

    // ─── REGULAR USER LOGIN ───────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { badgeNumber }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid badge number or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid badge number or password.' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
        badge: user.badgeNumber,
        isSuperAdmin: false,
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
};
