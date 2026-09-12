import type { Context } from 'hono';
import type { AppEnv } from '../types/env';
import { getAllContactMessagesService, getContactMessageByIdService, createContactMessageService, markContactMessageReadService, deleteContactMessageService } from './contact.service';

// GET /api/contact
export const getAllContactMessages = async (c: Context<AppEnv>) => {
    try {
        const messages = await getAllContactMessagesService();
        if (messages.length === 0) {
            return c.json({ message: 'No contact messages found' }, 404);
        }
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

// POST /api/contact
export const createContactMessage = async (c: Context<AppEnv>) => {
    const { name, email, message } = await c.req.json();
    if (!name || !email || !message) {
        return c.json({ error: 'Name, email, and message are required' }, 400);
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
