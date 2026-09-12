import type { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import type { AppEnv } from '../types/env';

export const authenticate = async (c: Context<AppEnv>, next: Next) => {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return c.json({ error: 'Unauthorized - no token provided' }, 401);
    }
    try {
        const decoded = jwt.verify(token, c.env.JWT_SECRET) as { userId: number };
        c.set('userId', decoded.userId);
        await next();
    } catch {
        return c.json({ error: 'Unauthorized - invalid token' }, 401);
    }
};
