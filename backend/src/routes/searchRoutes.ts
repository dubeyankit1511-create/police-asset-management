import { Router } from 'express';
import { searchAssets } from '../controllers/searchController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, searchAssets);

export default router;
