import type { Context } from 'hono';
import type { AppEnv } from '../types/env';
import { getAllCCommunitiesService, getCommunityByIdService, createCommunityService, updateCommunityService, deleteCommunityService } from './community.services';
import { readUploadedFile, uploadFileToCloudinary } from '../Middleware/upload';

// GET /api/communities
export const getAllCommunities = async (c: Context<AppEnv>) => {
    try {
        const existingCommunities = await getAllCCommunitiesService();
        if (!existingCommunities || existingCommunities.length === 0) {
            return c.json({ message: 'No communities found' }, 404);
        }
        return c.json(existingCommunities, 200);
    } catch (error) {
        console.error('Error fetching communities:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// GET /api/communities/:communityId
export const getCommunityById = async (c: Context<AppEnv>) => {
    const communityId = parseInt(c.req.param('communityId') ?? '');
    if (isNaN(communityId)) {
        return c.json({ error: 'Invalid community ID' }, 400);
    }
    try {
        const communityData = await getCommunityByIdService(communityId);
        if (!communityData) {
            return c.json({ error: 'Community not found' }, 404);
        }
        return c.json(communityData, 200);
    } catch (error) {
        console.error('Error fetching community:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// POST /api/communities
export const createCommunity = async (c: Context<AppEnv>) => {
    const { name, role, description, logoUrl, bioUrl, order } = await c.req.json();
    if (!name) {
        return c.json({ error: 'Name is required' }, 400);
    }
    try {
        const result = await createCommunityService({ name, role, description, logoUrl, bioUrl, order });
        return c.json({ message: result }, 201);
    } catch (error) {
        console.error('Error creating community:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// PUT /api/communities/:communityId
export const updateCommunity = async (c: Context<AppEnv>) => {
    const communityId = parseInt(c.req.param('communityId') ?? '');
    if (isNaN(communityId)) {
        return c.json({ error: 'Invalid community ID' }, 400);
    }
    const { name, role, description, logoUrl, bioUrl, order } = await c.req.json();
    if (!name) {
        return c.json({ error: 'Name is required' }, 400);
    }
    try {
        const result = await updateCommunityService(communityId, { name, role, description, logoUrl, bioUrl, order });
        return c.json({ message: result }, 200);
    } catch (error) {
        console.error('Error updating community:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// DELETE /api/communities/:communityId
export const deleteCommunity = async (c: Context<AppEnv>) => {
    const communityId = parseInt(c.req.param('communityId') ?? '');
    if (isNaN(communityId)) {
        return c.json({ error: 'Invalid community ID' }, 400);
    }
    try {
        const result = await deleteCommunityService(communityId);
        return c.json({ message: result }, 200);
    } catch (error) {
        console.error('Error deleting community:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// POST /api/communities/:communityId/logo — upload community logo to Cloudinary
export const uploadCommunityLogo = async (c: Context<AppEnv>) => {
    const communityId = parseInt(c.req.param('communityId') ?? '');
    if (isNaN(communityId)) {
        return c.json({ error: 'Invalid community ID' }, 400);
    }
    const file = await readUploadedFile(c, 'logo', 'image');
    if (file instanceof Response) return file;

    try {
        const existing = await getCommunityByIdService(communityId);
        if (!existing) {
            return c.json({ error: 'Community not found' }, 404);
        }
        const uploaded = await uploadFileToCloudinary(c.env, file, 'portfolio/community', 'logo');
        const logoUrl = uploaded.secure_url;
        const result = await updateCommunityService(communityId, { ...existing, logoUrl });
        return c.json({ message: result, logoUrl }, 200);
    } catch (error) {
        console.error('Error uploading community logo:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};
