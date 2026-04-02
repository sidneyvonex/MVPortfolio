import { Request, Response } from 'express';
import {
    getAllExperienceService,
    getExperienceByIdService,
    createExperienceService,
    updateExperienceService,
    deleteExperienceService
} from './experience.services';

// GET /api/experience
export const getAllExperience = async (_req: Request, res: Response) => {
    try {
        const experience = await getAllExperienceService();
        res.status(200).json(experience);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        res.status(500).json({ error: message });
    }
};

// GET /api/experience/:experienceId
export const getExperienceById = async (req: Request, res: Response) => {
    const experienceId = parseInt(req.params.experienceId as string);
    if (isNaN(experienceId)) {
        res.status(400).json({ error: 'Invalid experience ID' });
        return;
    }
    try {
        const entry = await getExperienceByIdService(experienceId);
        if (!entry) {
            res.status(404).json({ error: 'Experience entry not found' });
            return;
        }
        res.status(200).json(entry);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        res.status(500).json({ error: message });
    }
};

// POST /api/experience
export const createExperience = async (req: Request, res: Response) => {
    const { company, role, location, startDate, endDate, bullets, order } = req.body;
    if (!company || !role || !startDate) {
        res.status(400).json({ error: 'Company, role, and startDate are required' });
        return;
    }
    try {
        const result = await createExperienceService({ company, role, location, startDate, endDate, bullets, order });
        res.status(201).json({ message: result });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        res.status(500).json({ error: message });
    }
};

// PUT /api/experience/:experienceId
export const updateExperience = async (req: Request, res: Response) => {
    const experienceId = parseInt(req.params.experienceId as string);
    if (isNaN(experienceId)) {
        res.status(400).json({ error: 'Invalid experience ID' });
        return;
    }
    const { company, role, location, startDate, endDate, bullets, order } = req.body;
    if (!company || !role || !startDate) {
        res.status(400).json({ error: 'Company, role, and startDate are required' });
        return;
    }
    try {
        const result = await updateExperienceService(experienceId, { company, role, location, startDate, endDate, bullets, order });
        res.status(200).json({ message: result });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        res.status(500).json({ error: message });
    }
};

// DELETE /api/experience/:experienceId
export const deleteExperience = async (req: Request, res: Response) => {
    const experienceId = parseInt(req.params.experienceId as string);
    if (isNaN(experienceId)) {
        res.status(400).json({ error: 'Invalid experience ID' });
        return;
    }
    try {
        const result = await deleteExperienceService(experienceId);
        res.status(200).json({ message: result });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        res.status(500).json({ error: message });
    }
};