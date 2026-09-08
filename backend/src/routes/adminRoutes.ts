import { Router } from 'express';
import { getAllUsers, createUser, updateUser, deleteUser } from '../controllers/adminController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

// All admin routes require authentication + ADMIN role
router.use(authenticateToken);
router.use(authorizeRole(['ADMIN']));

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
