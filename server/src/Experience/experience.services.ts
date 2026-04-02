import db from '../db/index';
import { eq, asc } from 'drizzle-orm';
import { experienceTable, TExperienceInsert, TExperienceSelect } from '../db/schema';

export const getAllExperienceService = async (): Promise<TExperienceSelect[]> => {
    return await db.query.experienceTable.findMany({
        orderBy: asc(experienceTable.order)
    });
};

export const getExperienceByIdService = async (experienceId: number): Promise<TExperienceSelect | undefined> => {
    return await db.query.experienceTable.findFirst({
        where: eq(experienceTable.experienceId, experienceId)
    });
};

export const createExperienceService = async (data: TExperienceInsert): Promise<string> => {
    await db.insert(experienceTable).values(data);
    return 'Experience entry created successfully';
};

export const updateExperienceService = async (experienceId: number, data: TExperienceInsert): Promise<string> => {
    await db.update(experienceTable).set(data).where(eq(experienceTable.experienceId, experienceId));
    return 'Experience entry updated successfully';
};

export const deleteExperienceService = async (experienceId: number): Promise<string> => {
    await db.delete(experienceTable).where(eq(experienceTable.experienceId, experienceId));
    return 'Experience entry deleted successfully';
};