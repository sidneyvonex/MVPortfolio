import type { Context } from 'hono';
import type { AppEnv } from '../types/env';
import {
    getAllExperienceService,
    getExperienceByIdService,
    createExperienceService,
    updateExperienceService,
    deleteExperienceService
} from './experience.services';

// GET /api/experience
export const getAllExperience = async (c: Context<AppEnv>) => {
    try {
        const experience = await getAllExperienceService();
        return c.json(experience, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// GET /api/experience/:experienceId
export const getExperienceById = async (c: Context<AppEnv>) => {
    const experienceId = parseInt(c.req.param('experienceId') ?? '');
    if (isNaN(experienceId)) {
        return c.json({ error: 'Invalid experience ID' }, 400);
    }
    try {
        const entry = await getExperienceByIdService(experienceId);
        if (!entry) {
            return c.json({ error: 'Experience entry not found' }, 404);
        }
        return c.json(entry, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// POST /api/experience
export const createExperience = async (c: Context<AppEnv>) => {
    const { company, role, location, startDate, endDate, bullets, order } = await c.req.json();
    if (!company || !role || !startDate) {
        return c.json({ error: 'Company, role, and startDate are required' }, 400);
    }
    try {
        const result = await createExperienceService({ company, role, location, startDate, endDate, bullets, order });
        return c.json({ message: result }, 201);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// PUT /api/experience/:experienceId
export const updateExperience = async (c: Context<AppEnv>) => {
    const experienceId = parseInt(c.req.param('experienceId') ?? '');
    if (isNaN(experienceId)) {
        return c.json({ error: 'Invalid experience ID' }, 400);
    }
    const { company, role, location, startDate, endDate, bullets, order } = await c.req.json();
    if (!company || !role || !startDate) {
        return c.json({ error: 'Company, role, and startDate are required' }, 400);
    }
    try {
        const result = await updateExperienceService(experienceId, { company, role, location, startDate, endDate, bullets, order });
        return c.json({ message: result }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// DELETE /api/experience/:experienceId
export const deleteExperience = async (c: Context<AppEnv>) => {
    const experienceId = parseInt(c.req.param('experienceId') ?? '');
    if (isNaN(experienceId)) {
        return c.json({ error: 'Invalid experience ID' }, 400);
    }
    try {
        const result = await deleteExperienceService(experienceId);
        return c.json({ message: result }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};
