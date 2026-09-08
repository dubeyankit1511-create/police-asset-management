import { Response } from 'express';
import { prisma } from '../../index';
import { AuthRequest } from '../middleware/authMiddleware';
import { saveFileAndCalculateHash, verifyFileIntegrity } from '../services/storageService';
import { anchorHashToBlockchain } from '../services/blockchainService';

export const uploadDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, classification, caseId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided.' });
    }

    if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });

    // Save file and get hash
    const { s3Key, fileHash, fileSize } = await saveFileAndCalculateHash(file);

    // Anchor the document hash to the blockchain for irrefutable proof
    const onchainTxId = await anchorHashToBlockchain(fileHash);

    // Database transaction to ensure both document and version are created together
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Document
      const document = await tx.document.create({
        data: {
          title,
          description,
          classification: classification || 'RESTRICTED',
          creatorId: req.user!.userId,
          caseId: caseId || null,
        }
      });

      // 2. Create initial Version
      const version = await tx.documentVersion.create({
        data: {
          documentId: document.id,
          versionNum: 1,
          s3Key,
          fileHash,
          onchainTxId,
          fileSize,
          mimeType: file.mimetype,
          createdBy: req.user!.userId
        }
      });

      // 3. Update document with currentVersionId
      await tx.document.update({
        where: { id: document.id },
        data: { currentVersionId: version.id }
      });

      return { document, version };
    });

    res.status(201).json({
      message: 'Document uploaded, secured, and anchored to blockchain successfully.',
      document: result.document,
      version: result.version
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload document.' });
  }
};

export const downloadDocument = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const versionId = req.params['versionId'] as string;

    // Fetch version logic
    const version = await prisma.documentVersion.findUnique({
      where: { id: versionId }
    });

    if (!version || version.documentId !== id) {
      return res.status(404).json({ error: 'Document version not found.' });
    }

    // Verify Integrity before allowing download
    const isIntact = await verifyFileIntegrity(version.s3Key, version.fileHash);
    
    if (!isIntact) {
      // Evidentiary integrity compromised!
      return res.status(500).json({ 
        error: 'CRITICAL SECURITY ALERT: Document integrity check failed. The file has been modified since it was originally uploaded.' 
      });
    }

    // In a real S3 implementation, this would generate a pre-signed URL.
    // For local dev, we just send the file path
    res.status(200).json({
      message: 'Document integrity verified.',
      downloadUrl: `/uploads/${version.s3Key}`,
      fileHash: version.fileHash
    });

  } catch (error) {
    console.error('Download Error:', error);
    res.status(500).json({ error: 'Failed to download document.' });
  }
};
