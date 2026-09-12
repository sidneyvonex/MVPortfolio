import { Hono } from 'hono';
import type { AppEnv } from '../types/env';
import { createCommunity, getAllCommunities, getCommunityById, updateCommunity, deleteCommunity, uploadCommunityLogo } from './community.controller';
import { authenticate } from '../Middleware/auth';

export const CommunityRouter = new Hono<AppEnv>();

CommunityRouter.get('/communities', getAllCommunities);
CommunityRouter.get('/communities/:communityId', getCommunityById);
CommunityRouter.post('/communities', authenticate, createCommunity);
CommunityRouter.put('/communities/:communityId', authenticate, updateCommunity);
CommunityRouter.delete('/communities/:communityId', authenticate, deleteCommunity);
CommunityRouter.post('/communities/:communityId/logo', authenticate, uploadCommunityLogo);
