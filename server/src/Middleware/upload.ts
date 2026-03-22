import path from 'path';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import cloudinary from '../config/cloudinary';

// Store file in memory, then stream to Cloudinary (compatible with cloudinary v2)
const memoryStorage = multer.memoryStorage();

export const upload = multer({
    storage: memoryStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only jpg, png, webp, svg, gif are allowed.'));
        }
    },
});

export const uploadPdf = multer({
    storage: memoryStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF files are allowed.'));
        }
    },
});

// Call this after upload.single() / uploadPdf.single() to push the buffer to Cloudinary.
// Pass resourceType 'raw' for PDFs, default 'image' for images.
// Attaches the Cloudinary URL to req.file.path for controllers to read.
export const uploadToCloudinary = (folder = 'portfolio', resourceType: 'image' | 'raw' | 'video' | 'auto' = 'image') =>
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.file) return next();
        try {
            const result = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder,
                        resource_type: resourceType,
                        public_id: `${Date.now()}-${req.file!.fieldname}${resourceType === 'raw' ? path.extname(req.file!.originalname) : ''}`,
                        ...(resourceType === 'image' && { transformation: [{ quality: 'auto', fetch_format: 'auto' }] }),
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file!.buffer);
            });
            // Attach the URL so controllers can read it as req.file.path
            (req.file as any).path = result.secure_url;
            next();
        } catch (error) {
            next(error);
        }
    };
