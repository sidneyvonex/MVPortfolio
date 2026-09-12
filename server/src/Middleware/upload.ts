import type { Context } from 'hono';
import { uploadToCloudinary, type CloudinaryEnv } from '../config/cloudinary';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10MB

// Pulls a single named file out of a multipart/form-data body and validates it.
// Returns null (and writes a 400 response via `onError`) if validation fails.
export const readUploadedFile = async (
    c: Context,
    fieldName: string,
    kind: 'image' | 'pdf'
): Promise<File | Response> => {
    const body = await c.req.parseBody();
    const file = body[fieldName];

    if (!(file instanceof File)) {
        return c.json({ error: `No ${kind} file provided` }, 400);
    }

    if (kind === 'image') {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return c.json({ error: 'Invalid file type. Only jpg, png, webp, svg, gif are allowed.' }, 400);
        }
        if (file.size > MAX_IMAGE_BYTES) {
            return c.json({ error: 'Image exceeds 5MB limit' }, 400);
        }
    } else {
        if (file.type !== 'application/pdf') {
            return c.json({ error: 'Invalid file type. Only PDF files are allowed.' }, 400);
        }
        if (file.size > MAX_PDF_BYTES) {
            return c.json({ error: 'PDF exceeds 10MB limit' }, 400);
        }
    }

    return file;
};

// Uploads an already-validated file to Cloudinary and returns its secure URL.
// `resourceType` 'raw' is used for PDFs; images use 'image' with auto quality/format.
export const uploadFileToCloudinary = (
    env: CloudinaryEnv,
    file: File,
    folder: string,
    fieldName: string,
    resourceType: 'image' | 'raw' = 'image'
) => {
    const ext = resourceType === 'raw' && file.name.includes('.') ? `.${file.name.split('.').pop()}` : '';
    return uploadToCloudinary(env, file, {
        folder,
        resourceType,
        publicId: `${Date.now()}-${fieldName}${ext}`,
        transformation: resourceType === 'image' ? 'q_auto,f_auto' : undefined,
    });
};
