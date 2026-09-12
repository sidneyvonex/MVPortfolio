import { Hono } from 'hono';
import type { AppEnv } from '../types/env';
import {
    getAllTestimonials,
    getTestimonialById,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    uploadTestimonialAvatar
} from './Testimonials.controller';
import { authenticate } from '../Middleware/auth';

export const TestimonialsRouter = new Hono<AppEnv>();

TestimonialsRouter.get('/testimonials', getAllTestimonials);
TestimonialsRouter.get('/testimonials/:testimonialId', getTestimonialById);
TestimonialsRouter.post('/testimonials', authenticate, createTestimonial);
TestimonialsRouter.put('/testimonials/:testimonialId', authenticate, updateTestimonial);
TestimonialsRouter.delete('/testimonials/:testimonialId', authenticate, deleteTestimonial);
TestimonialsRouter.post('/testimonials/:testimonialId/avatar', authenticate, uploadTestimonialAvatar);
