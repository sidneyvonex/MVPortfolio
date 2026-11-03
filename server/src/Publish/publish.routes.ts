import { Hono } from 'hono';
import type { AppEnv } from '../types/env';
import { publishSite, getPublishStatus } from './publish.controller';
import { authenticate } from '../Middleware/auth';

export const PublishRouter = new Hono<AppEnv>();

PublishRouter.post('/publish', authenticate, publishSite);
PublishRouter.get('/publish', authenticate, getPublishStatus);
