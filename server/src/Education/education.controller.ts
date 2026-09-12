import type { Context } from 'hono';
import type { AppEnv } from '../types/env';
import {
    getAllEducationService,
    getEducationByIdService,
    createEducationService,
    updateEducationService,
    deleteEducationService
} from './education.services';
import { readUploadedFile, uploadFileToCloudinary } from '../Middleware/upload';

// GET /api/education
export const getAllEducation = async (c: Context<AppEnv>) => {
    try {
        const education = await getAllEducationService();
        return c.json(education, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// GET /api/education/:educationId
export const getEducationById = async (c: Context<AppEnv>) => {
    const educationId = parseInt(c.req.param('educationId') ?? '');
    if (isNaN(educationId)) {
        return c.json({ error: 'Invalid education ID' }, 400);
    }
    try {
        const entry = await getEducationByIdService(educationId);
        if (!entry) {
            return c.json({ error: 'Education entry not found' }, 404);
        }
        return c.json(entry, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// POST /api/education
export const createEducation = async (c: Context<AppEnv>) => {
    const { institution, degree, description, logoUrl, startDate, endDate, order } = await c.req.json();
    if (!institution || !degree) {
        return c.json({ error: 'Institution and degree are required' }, 400);
    }
    try {
        const result = await createEducationService({ institution, degree, description, logoUrl, startDate, endDate, order });
        return c.json({ message: result }, 201);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// PUT /api/education/:educationId
export const updateEducation = async (c: Context<AppEnv>) => {
    const educationId = parseInt(c.req.param('educationId') ?? '');
    if (isNaN(educationId)) {
        return c.json({ error: 'Invalid education ID' }, 400);
    }
    const { institution, degree, description, logoUrl, startDate, endDate, order } = await c.req.json();
    if (!institution || !degree) {
        return c.json({ error: 'Institution and degree are required' }, 400);
    }
    try {
        const result = await updateEducationService(educationId, { institution, degree, description, logoUrl, startDate, endDate, order });
        return c.json({ message: result }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// DELETE /api/education/:educationId
export const deleteEducation = async (c: Context<AppEnv>) => {
    const educationId = parseInt(c.req.param('educationId') ?? '');
    if (isNaN(educationId)) {
        return c.json({ error: 'Invalid education ID' }, 400);
    }
    try {
        const result = await deleteEducationService(educationId);
        return c.json({ message: result }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// POST /api/education/:educationId/logo — upload logo via Cloudinary
export const uploadEducationLogo = async (c: Context<AppEnv>) => {
    const educationId = parseInt(c.req.param('educationId') ?? '');
    if (isNaN(educationId)) {
        return c.json({ error: 'Invalid education ID' }, 400);
    }
    const file = await readUploadedFile(c, 'logo', 'image');
    if (file instanceof Response) return file;

    try {
        const entry = await getEducationByIdService(educationId);
        if (!entry) {
            return c.json({ error: 'Education entry not found' }, 404);
        }
        const uploaded = await uploadFileToCloudinary(c.env, file, 'portfolio/education', 'logo');
        const logoUrl = uploaded.secure_url;
        const result = await updateEducationService(educationId, { ...entry, logoUrl });
        return c.json({ message: result, logoUrl }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};
