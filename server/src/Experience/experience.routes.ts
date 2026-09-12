import { Hono } from 'hono';
import type { AppEnv } from '../types/env';
import {
    getAllExperience,
    getExperienceById,
    createExperience,
    updateExperience,
    deleteExperience
} from './experience.controller';
import { authenticate } from '../Middleware/auth';

export const ExperienceRouter = new Hono<AppEnv>();

ExperienceRouter.get('/experience', getAllExperience);
ExperienceRouter.get('/experience/:experienceId', getExperienceById);
ExperienceRouter.post('/experience', authenticate, createExperience);
ExperienceRouter.put('/experience/:experienceId', authenticate, updateExperience);
ExperienceRouter.delete('/experience/:experienceId', authenticate, deleteExperience);
