import { Hono } from 'hono';
import type { AppEnv } from '../types/env';
import {
    getAllSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill,
    uploadSkillIcon
} from './skills.controller';
import { authenticate } from '../Middleware/auth';

export const SkillsRouter = new Hono<AppEnv>();

SkillsRouter.get('/skills', getAllSkills);
SkillsRouter.get('/skills/:skillId', getSkillById);
SkillsRouter.post('/skills', authenticate, createSkill);
SkillsRouter.put('/skills/:skillId', authenticate, updateSkill);
SkillsRouter.delete('/skills/:skillId', authenticate, deleteSkill);
SkillsRouter.post('/skills/:skillId/icon', authenticate, uploadSkillIcon);
