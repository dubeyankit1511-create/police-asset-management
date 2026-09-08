import { Router } from 'express';
import multer from 'multer';
import { uploadDocument, downloadDocument } from '../controllers/documentController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Configure multer to use memory storage so we can calculate the hash easily before writing to disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post('/upload', authenticateToken, upload.single('document'), uploadDocument);
router.get('/:id/versions/:versionId/download', authenticateToken, downloadDocument);

export default router;
