import type { Context } from 'hono';
import type { AppEnv } from '../types/env';
import {
    getAllTestimonialsService,
    getTestimonialByIdService,
    createTestimonialService,
    updateTestimonialService,
    deleteTestimonialService
} from './Testimonials.service';
import { readUploadedFile, uploadFileToCloudinary } from '../Middleware/upload';

// GET /api/testimonials
export const getAllTestimonials = async (c: Context<AppEnv>) => {
    try {
        const testimonials = await getAllTestimonialsService();
        return c.json(testimonials, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// GET /api/testimonials/:testimonialId
export const getTestimonialById = async (c: Context<AppEnv>) => {
    const testimonialId = parseInt(c.req.param('testimonialId') ?? '');
    if (isNaN(testimonialId)) {
        return c.json({ error: 'Invalid testimonial ID' }, 400);
    }
    try {
        const testimonial = await getTestimonialByIdService(testimonialId);
        if (!testimonial) {
            return c.json({ error: 'Testimonial not found' }, 404);
        }
        return c.json(testimonial, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// POST /api/testimonials
export const createTestimonial = async (c: Context<AppEnv>) => {
    const { name, role, avatarUrl, message, rating, order } = await c.req.json();
    if (!name || !role || !message) {
        return c.json({ error: 'Name, role, and message are required' }, 400);
    }
    try {
        const result = await createTestimonialService({ name, role, avatarUrl, message, rating, order });
        return c.json({ message: result }, 201);
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: msg }, 500);
    }
};

// PUT /api/testimonials/:testimonialId
export const updateTestimonial = async (c: Context<AppEnv>) => {
    const testimonialId = parseInt(c.req.param('testimonialId') ?? '');
    if (isNaN(testimonialId)) {
        return c.json({ error: 'Invalid testimonial ID' }, 400);
    }
    const { name, role, avatarUrl, message, rating, order } = await c.req.json();
    if (!name || !role || !message) {
        return c.json({ error: 'Name, role, and message are required' }, 400);
    }
    try {
        const result = await updateTestimonialService(testimonialId, { name, role, avatarUrl, message, rating, order });
        return c.json({ message: result }, 200);
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: msg }, 500);
    }
};

// DELETE /api/testimonials/:testimonialId
export const deleteTestimonial = async (c: Context<AppEnv>) => {
    const testimonialId = parseInt(c.req.param('testimonialId') ?? '');
    if (isNaN(testimonialId)) {
        return c.json({ error: 'Invalid testimonial ID' }, 400);
    }
    try {
        const result = await deleteTestimonialService(testimonialId);
        return c.json({ message: result }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// POST /api/testimonials/:testimonialId/avatar — upload avatar via Cloudinary
export const uploadTestimonialAvatar = async (c: Context<AppEnv>) => {
    const testimonialId = parseInt(c.req.param('testimonialId') ?? '');
    if (isNaN(testimonialId)) {
        return c.json({ error: 'Invalid testimonial ID' }, 400);
    }
    const file = await readUploadedFile(c, 'avatar', 'image');
    if (file instanceof Response) return file;

    try {
        const testimonial = await getTestimonialByIdService(testimonialId);
        if (!testimonial) {
            return c.json({ error: 'Testimonial not found' }, 404);
        }
        const uploaded = await uploadFileToCloudinary(c.env, file, 'portfolio/testimonials', 'avatar');
        const avatarUrl = uploaded.secure_url;
        const result = await updateTestimonialService(testimonialId, { ...testimonial, avatarUrl });
        return c.json({ message: result, avatarUrl }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};
