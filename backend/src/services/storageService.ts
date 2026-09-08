import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Emulating S3 storage with a local directory for development purposes.
const UPLOADS_DIR = path.join(__dirname, '../../uploads');

export const saveFileAndCalculateHash = (file: Express.Multer.File): Promise<{ s3Key: string, fileHash: string, fileSize: number }> => {
  return new Promise((resolve, reject) => {
    const fileExtension = path.extname(file.originalname);
    const uniqueFilename = `${crypto.randomUUID()}${fileExtension}`;
    const targetPath = path.join(UPLOADS_DIR, uniqueFilename);

    // Create read stream from multer buffer
    const hash = crypto.createHash('sha256');
    
    // Write the file to disk
    fs.writeFile(targetPath, file.buffer, (err) => {
      if (err) return reject(err);
      
      // Calculate hash
      hash.update(file.buffer);
      const fileHash = hash.digest('hex');
      
      resolve({
        s3Key: uniqueFilename, // In production, this would be an S3 Object Key
        fileHash,
        fileSize: file.size
      });
    });
  });
};

export const verifyFileIntegrity = (s3Key: string, expectedHash: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const targetPath = path.join(UPLOADS_DIR, s3Key);
    const hash = crypto.createHash('sha256');
    
    const stream = fs.createReadStream(targetPath);
    
    stream.on('data', (data) => {
      hash.update(data);
    });
    
    stream.on('end', () => {
      const actualHash = hash.digest('hex');
      resolve(actualHash === expectedHash);
    });
    
    stream.on('error', (err) => {
      reject(err);
    });
  });
};
