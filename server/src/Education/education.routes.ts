import { Hono } from 'hono';
import type { AppEnv } from '../types/env';
import {
    getAllEducation,
    getEducationById,
    createEducation,
    updateEducation,
    deleteEducation,
    uploadEducationLogo
} from './education.controller';
import { authenticate } from '../Middleware/auth';

export const EducationRouter = new Hono<AppEnv>();

EducationRouter.get('/education', getAllEducation);
EducationRouter.get('/education/:educationId', getEducationById);
EducationRouter.post('/education', authenticate, createEducation);
EducationRouter.put('/education/:educationId', authenticate, updateEducation);
EducationRouter.delete('/education/:educationId', authenticate, deleteEducation);
EducationRouter.post('/education/:educationId/logo', authenticate, uploadEducationLogo);
