import type { Context } from 'hono';
import type { AppEnv } from '../types/env';
import { getAllContactMessagesService, getContactMessageByIdService, createContactMessageService, markContactMessageReadService, deleteContactMessageService } from './contact.service';

// GET /api/contact
export const getAllContactMessages = async (c: Context<AppEnv>) => {
    try {
        // An empty inbox is a valid answer, not a missing resource.
        const messages = await getAllContactMessagesService();
        return c.json(messages, 200);
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// GET /api/contact/:contactMessageId
export const getContactMessageById = async (c: Context<AppEnv>) => {
    const contactMessageId = parseInt(c.req.param('contactMessageId') ?? '');
    if (isNaN(contactMessageId)) {
        return c.json({ error: 'Invalid contact message ID' }, 400);
    }
    try {
        const messageData = await getContactMessageByIdService(contactMessageId);
        if (!messageData) {
            return c.json({ error: 'Contact message not found' }, 404);
        }
        return c.json(messageData, 200);
    } catch (error) {
        console.error('Error fetching contact message:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// Limits for the public form: generous for real messages, small enough to stop abuse.
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact — public
export const createContactMessage = async (c: Context<AppEnv>) => {
    const body = await c.req.json().catch(() => null);
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    if (!name || !email || !message) {
        return c.json({ error: 'Name, email, and message are required' }, 400);
    }
    if (name.length > MAX_NAME || email.length > MAX_EMAIL || message.length > MAX_MESSAGE) {
        return c.json({ error: `Name, email or message is too long (message limit ${MAX_MESSAGE} characters)` }, 400);
    }
    if (!EMAIL_PATTERN.test(email)) {
        return c.json({ error: 'Please enter a valid email address' }, 400);
    }
    try {
        const result = await createContactMessageService({ name, email, message });
        return c.json({ message: result }, 201);
    } catch (error) {
        console.error('Error creating contact message:', error);
        const msg = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: msg }, 500);
    }
};

// PATCH /api/contact/:contactMessageId/read
export const markContactMessageRead = async (c: Context<AppEnv>) => {
    const contactMessageId = parseInt(c.req.param('contactMessageId') ?? '');
    if (isNaN(contactMessageId)) {
        return c.json({ error: 'Invalid contact message ID' }, 400);
    }
    try {
        const result = await markContactMessageReadService(contactMessageId);
        return c.json({ message: result }, 200);
    } catch (error) {
        console.error('Error marking message as read:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// DELETE /api/contact/:contactMessageId
export const deleteContactMessage = async (c: Context<AppEnv>) => {
    const contactMessageId = parseInt(c.req.param('contactMessageId') ?? '');
    if (isNaN(contactMessageId)) {
        return c.json({ error: 'Invalid contact message ID' }, 400);
    }
    try {
        const result = await deleteContactMessageService(contactMessageId);
        return c.json({ message: result }, 200);
    } catch (error) {
        console.error('Error deleting contact message:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};
