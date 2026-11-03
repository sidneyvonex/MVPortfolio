import type { Context } from 'hono';
import type { AppEnv } from '../types/env';
import {
    getAllProjectsService,
    getFeaturedProjectsService,
    getProjectByIdService,
    getProjectBySlugService,
    toSlug,
    uniqueSlugService,
    createProjectService,
    updateProjectService,
    deleteProjectService,
    toggleFeaturedProjectService
} from './projects.services';
import { readUploadedFile, uploadFileToCloudinary } from '../Middleware/upload';

// GET /api/projects
export const getAllProjects = async (c: Context<AppEnv>) => {
    try {
        const projects = await getAllProjectsService();
        return c.json(projects, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// GET /api/projects/featured
export const getFeaturedProjects = async (c: Context<AppEnv>) => {
    try {
        const projects = await getFeaturedProjectsService();
        return c.json(projects, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// GET /api/projects/:projectId
export const getProjectById = async (c: Context<AppEnv>) => {
    const projectId = parseInt(c.req.param('projectId') ?? '');
    if (isNaN(projectId)) {
        return c.json({ error: 'Invalid project ID' }, 400);
    }
    try {
        const project = await getProjectByIdService(projectId);
        if (!project) {
            return c.json({ error: 'Project not found' }, 404);
        }
        return c.json(project, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// GET /api/projects/slug/:slug — the case study page looks projects up by slug
export const getProjectBySlug = async (c: Context<AppEnv>) => {
    const slug = c.req.param('slug') ?? '';
    try {
        const project = await getProjectBySlugService(slug);
        if (!project) {
            return c.json({ error: 'Project not found' }, 404);
        }
        return c.json(project, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// POST /api/projects — slug is optional; without one it comes from the title
export const createProject = async (c: Context<AppEnv>) => {
    const { title, slug, summary, description, techStack, imageUrl, liveUrl, githubUrl, featured, order } = await c.req.json();
    if (!title || !description || !techStack) {
        return c.json({ error: 'Title, description, and techStack are required' }, 400);
    }
    const techStackArray = Array.isArray(techStack) ? techStack : techStack.split(',').map((s: string) => s.trim());
    try {
        const finalSlug = await uniqueSlugService(toSlug(slug || title));
        const result = await createProjectService({ title, slug: finalSlug, summary: summary || null, description, techStack: techStackArray, imageUrl, liveUrl, githubUrl, featured, order });
        return c.json({ message: result }, 201);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// PUT /api/projects/:projectId
export const updateProject = async (c: Context<AppEnv>) => {
    const projectId = parseInt(c.req.param('projectId') ?? '');
    if (isNaN(projectId)) {
        return c.json({ error: 'Invalid project ID' }, 400);
    }
    const { title, slug, summary, description, techStack, imageUrl, liveUrl, githubUrl, featured, order } = await c.req.json();
    if (!title || !description || !techStack) {
        return c.json({ error: 'Title, description, and techStack are required' }, 400);
    }
    const techStackArray = Array.isArray(techStack) ? techStack : techStack.split(',').map((s: string) => s.trim());
    try {
        // Fields left out of the request keep their stored value
        const finalSlug = slug === undefined ? undefined : await uniqueSlugService(toSlug(slug || title), projectId);
        const result = await updateProjectService(projectId, { title, slug: finalSlug, summary: summary === undefined ? undefined : summary || null, description, techStack: techStackArray, imageUrl, liveUrl, githubUrl, featured, order });
        return c.json({ message: result }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// DELETE /api/projects/:projectId
export const deleteProject = async (c: Context<AppEnv>) => {
    const projectId = parseInt(c.req.param('projectId') ?? '');
    if (isNaN(projectId)) {
        return c.json({ error: 'Invalid project ID' }, 400);
    }
    try {
        const result = await deleteProjectService(projectId);
        return c.json({ message: result }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// PATCH /api/projects/:projectId/featured — toggle featured flag
export const toggleFeaturedProject = async (c: Context<AppEnv>) => {
    const projectId = parseInt(c.req.param('projectId') ?? '');
    if (isNaN(projectId)) {
        return c.json({ error: 'Invalid project ID' }, 400);
    }
    try {
        const result = await toggleFeaturedProjectService(projectId);
        return c.json(result, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, message === 'Project not found' ? 404 : 500);
    }
};

// POST /api/projects/:projectId/image — upload project image via Cloudinary
export const uploadProjectImage = async (c: Context<AppEnv>) => {
    const projectId = parseInt(c.req.param('projectId') ?? '');
    if (isNaN(projectId)) {
        return c.json({ error: 'Invalid project ID' }, 400);
    }
    const file = await readUploadedFile(c, 'image', 'image');
    if (file instanceof Response) return file;

    try {
        const project = await getProjectByIdService(projectId);
        if (!project) {
            return c.json({ error: 'Project not found' }, 404);
        }
        const uploaded = await uploadFileToCloudinary(c.env, file, 'portfolio/projects', 'image');
        const imageUrl = uploaded.secure_url;
        const result = await updateProjectService(projectId, { ...project, imageUrl });
        return c.json({ message: result, imageUrl }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};
