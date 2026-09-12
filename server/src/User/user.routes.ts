import { Hono } from 'hono';
import type { AppEnv } from '../types/env';
import {
    register, login, uploadHeroImage, getHeroImageUrl, setResumeUrl, getResumeUrl,
    setTagline, getTagline, getAllSettings, updateSettings, uploadResumePdf, downloadResume
} from './user.controller';
import { authenticate } from '../Middleware/auth';

export const UserRouter = new Hono<AppEnv>();

UserRouter.post('/auth/login', login);
UserRouter.post('/auth/register', authenticate, register);
UserRouter.post('/auth/upload/hero', authenticate, uploadHeroImage);

UserRouter.get('/settings/hero', getHeroImageUrl);

UserRouter.post('/settings/resume', authenticate, setResumeUrl);
UserRouter.get('/settings/resume', getResumeUrl);
UserRouter.get('/settings/resume/download', (c) => downloadResume(c, 'attachment'));
UserRouter.get('/settings/resume/preview', (c) => downloadResume(c, 'inline'));

UserRouter.post('/settings/tagline', authenticate, setTagline);
UserRouter.get('/settings/tagline', getTagline);

UserRouter.get('/settings', getAllSettings);
UserRouter.put('/settings', authenticate, updateSettings);

UserRouter.post('/settings/resume/upload', authenticate, uploadResumePdf);
