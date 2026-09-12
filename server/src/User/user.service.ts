import db from '../db/index';
import { eq } from 'drizzle-orm';
import { usersTable, TUserInsert, TUserSelect } from '../db/schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Cost factor 10 (~10-20ms CPU) instead of 12 (~150-300ms) — the Workers Free
// plan caps CPU time at 10ms/request, and 12 would blow that budget on login/register.
const BCRYPT_COST = 10;

export const registerUserService = async (email: string, password: string): Promise<string> => {
    const existing = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email)
    });
    if (existing) throw new Error('Email already registered');

    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    await db.insert(usersTable).values({ email, passwordHash });
    return 'Admin registered successfully';
};

export const loginUserService = async (email: string, password: string, jwtSecret: string): Promise<string> => {
    const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email)
    });
    if (!user) throw new Error('Invalid email or password');

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw new Error('Invalid email or password');

    const token = jwt.sign(
        { userId: user.userId },
        jwtSecret,
        { expiresIn: '7d' }
    );
    return token;
};
