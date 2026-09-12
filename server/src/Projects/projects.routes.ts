import { Hono } from 'hono';
import type { AppEnv } from '../types/env';
import {
    getAllProjects,
    getFeaturedProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    toggleFeaturedProject,
    uploadProjectImage
} from './projects.controller';
import { authenticate } from '../Middleware/auth';

export const ProjectsRouter = new Hono<AppEnv>();

ProjectsRouter.get('/projects', getAllProjects);
ProjectsRouter.get('/projects/featured', getFeaturedProjects);
ProjectsRouter.get('/projects/:projectId', getProjectById);
ProjectsRouter.post('/projects', authenticate, createProject);
ProjectsRouter.put('/projects/:projectId', authenticate, updateProject);
ProjectsRouter.delete('/projects/:projectId', authenticate, deleteProject);
ProjectsRouter.post('/projects/:projectId/image', authenticate, uploadProjectImage);
ProjectsRouter.patch('/projects/:projectId/featured', authenticate, toggleFeaturedProject);
