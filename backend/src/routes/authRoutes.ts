import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Example of a Protected Route to test authentication and RBAC
router.get('/me', authenticateToken, (req, res) => {
  res.json({ message: 'You have access to this route.', user: (req as any).user });
});

// Example of an Admin-only Route
router.get('/admin-only', authenticateToken, authorizeRole(['ADMIN']), (req, res) => {
  res.json({ message: 'Welcome Admin.' });
});

export default router;
