import { Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../index';
import { AuthRequest } from '../middleware/authMiddleware';

// ─── LIST ALL USERS ───────────────────────────────────────────────────
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        badgeNumber: true,
        role: true,
        department: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ users, count: users.length });
  } catch (error) {
    console.error('Admin getAllUsers Error:', error);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
};

// ─── CREATE A NEW USER ────────────────────────────────────────────────
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, firstName, lastName, badgeNumber, role, department } = req.body;

    if (!email || !password || !firstName || !lastName || !department) {
      return res.status(400).json({ error: 'All required fields must be provided.' });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { badgeNumber }] }
    });
    if (existing) {
      return res.status(400).json({ error: 'User with this email or badge already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, passwordHash, firstName, lastName, badgeNumber, role: role || 'OFFICER', department },
      select: { id: true, email: true, firstName: true, lastName: true, badgeNumber: true, role: true, department: true, createdAt: true }
    });

    res.status(201).json({ message: 'User created successfully.', user });
  } catch (error) {
    console.error('Admin createUser Error:', error);
    res.status(500).json({ error: 'Failed to create user.' });
  }
};

// ─── UPDATE A USER ────────────────────────────────────────────────────
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params['id'] as string;
    const { email, firstName, lastName, badgeNumber, role, department, password } = req.body;

    const updateData: any = {};
    if (email) updateData.email = email;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (badgeNumber) updateData.badgeNumber = badgeNumber;
    if (role) updateData.role = role;
    if (department) updateData.department = department;
    if (password) updateData.passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, email: true, firstName: true, lastName: true, badgeNumber: true, role: true, department: true, updatedAt: true }
    });

    res.status(200).json({ message: 'User updated successfully.', user });
  } catch (error) {
    console.error('Admin updateUser Error:', error);
    res.status(500).json({ error: 'Failed to update user.' });
  }
};

// ─── DELETE A USER ────────────────────────────────────────────────────
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params['id'] as string;

    // Prevent deleting the super admin
    if (userId === 'SUPER-ADMIN-001') {
      return res.status(403).json({ error: 'Cannot delete the Super Administrator.' });
    }

    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Admin deleteUser Error:', error);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
};
