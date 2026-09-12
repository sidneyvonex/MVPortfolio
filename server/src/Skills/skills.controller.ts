import type { Context } from 'hono';
import type { AppEnv } from '../types/env';
import {
    getAllSkillsService,
    getSkillByIdService,
    createSkillService,
    updateSkillService,
    deleteSkillService
} from './skills.services';
import { readUploadedFile, uploadFileToCloudinary } from '../Middleware/upload';

// GET /api/skills
export const getAllSkills = async (c: Context<AppEnv>) => {
    try {
        const skills = await getAllSkillsService();
        return c.json(skills, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// GET /api/skills/:skillId
export const getSkillById = async (c: Context<AppEnv>) => {
    const skillId = parseInt(c.req.param('skillId') ?? '');
    if (isNaN(skillId)) {
        return c.json({ error: 'Invalid skill ID' }, 400);
    }
    try {
        const skill = await getSkillByIdService(skillId);
        if (!skill) {
            return c.json({ error: 'Skill not found' }, 404);
        }
        return c.json(skill, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// POST /api/skills
export const createSkill = async (c: Context<AppEnv>) => {
    const { name, category, iconUrl, order } = await c.req.json();
    if (!name || !category) {
        return c.json({ error: 'Name and category are required' }, 400);
    }
    try {
        const result = await createSkillService({ name, category, iconUrl, order });
        return c.json({ message: result }, 201);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// PUT /api/skills/:skillId
export const updateSkill = async (c: Context<AppEnv>) => {
    const skillId = parseInt(c.req.param('skillId') ?? '');
    if (isNaN(skillId)) {
        return c.json({ error: 'Invalid skill ID' }, 400);
    }
    const { name, category, iconUrl, order } = await c.req.json();
    if (!name || !category) {
        return c.json({ error: 'Name and category are required' }, 400);
    }
    try {
        const result = await updateSkillService(skillId, { name, category, iconUrl, order });
        return c.json({ message: result }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// DELETE /api/skills/:skillId
export const deleteSkill = async (c: Context<AppEnv>) => {
    const skillId = parseInt(c.req.param('skillId') ?? '');
    if (isNaN(skillId)) {
        return c.json({ error: 'Invalid skill ID' }, 400);
    }
    try {
        const result = await deleteSkillService(skillId);
        return c.json({ message: result }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// POST /api/skills/:skillId/icon — upload skill icon via Cloudinary
export const uploadSkillIcon = async (c: Context<AppEnv>) => {
    const skillId = parseInt(c.req.param('skillId') ?? '');
    if (isNaN(skillId)) {
        return c.json({ error: 'Invalid skill ID' }, 400);
    }
    const file = await readUploadedFile(c, 'icon', 'image');
    if (file instanceof Response) return file;

    try {
        const skill = await getSkillByIdService(skillId);
        if (!skill) {
            return c.json({ error: 'Skill not found' }, 404);
        }
        const uploaded = await uploadFileToCloudinary(c.env, file, 'portfolio/skills', 'icon');
        const iconUrl = uploaded.secure_url;
        const result = await updateSkillService(skillId, { ...skill, iconUrl });
        return c.json({ message: result, iconUrl }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};
