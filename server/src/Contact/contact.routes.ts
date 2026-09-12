import { Hono } from 'hono';
import type { AppEnv } from '../types/env';
import {
    getAllContactMessages,
    getContactMessageById,
    createContactMessage,
    markContactMessageRead,
    deleteContactMessage
} from './contact.controller';
import { authenticate } from '../Middleware/auth';

export const ContactRouter = new Hono<AppEnv>();

ContactRouter.post('/contact', createContactMessage);
ContactRouter.get('/contact', authenticate, getAllContactMessages);
ContactRouter.get('/contact/:contactMessageId', authenticate, getContactMessageById);
ContactRouter.delete('/contact/:contactMessageId', authenticate, deleteContactMessage);
ContactRouter.patch('/contact/:contactMessageId/read', authenticate, markContactMessageRead);
