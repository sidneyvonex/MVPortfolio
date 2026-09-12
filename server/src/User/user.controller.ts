import type { Context } from 'hono';
import type { AppEnv } from '../types/env';
import { registerUserService, loginUserService } from './user.service';
import db from '../db/index';
import { siteSettingsTable } from '../db/schema';
import { getPrivateDownloadUrl } from '../config/cloudinary';
import { readUploadedFile, uploadFileToCloudinary } from '../Middleware/upload';

const normalizeResumeUrl = (rawUrl: string, cloudName?: string) => {
    const url = rawUrl.trim();
    if (!url) return url;

    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    if (cloudName && (url.startsWith('/upload/') || url.startsWith('upload/'))) {
        const normalizedPath = url.startsWith('/') ? url : `/${url}`;
        return `https://res.cloudinary.com/${cloudName}/raw${normalizedPath}`;
    }

    return url;
};

const fetchResumeBytes = async (c: Context<AppEnv>, resumeUrl: string): Promise<ArrayBuffer> => {
    let effectiveUrl = resumeUrl;
    let upstream = await fetch(effectiveUrl, {
        redirect: 'follow',
        headers: {
            Accept: 'application/pdf,*/*;q=0.9',
            'User-Agent': 'portfolio-resume-proxy',
        },
    });

    if (!upstream.ok && upstream.status === 401 && resumeUrl.includes('res.cloudinary.com') && resumeUrl.includes('/raw/upload/')) {
        const match = resumeUrl.match(/\/raw\/upload\/(?:v\d+\/)?(.+)$/);
        const pathPart = match?.[1] ?? '';
        const clean = decodeURIComponent(pathPart).split('?')[0];
        const ext = clean.includes('.') ? clean.split('.').pop() ?? 'pdf' : 'pdf';
        const publicId = clean;
        const signedUrl = getPrivateDownloadUrl(c.env, publicId, ext, {
            resourceType: 'raw',
            expiresAt: Math.floor(Date.now() / 1000) + 120,
        });

        effectiveUrl = signedUrl;
        upstream = await fetch(effectiveUrl, {
            redirect: 'follow',
            headers: {
                Accept: 'application/pdf,*/*;q=0.9',
                'User-Agent': 'portfolio-resume-proxy',
            },
        });
    }

    if (!upstream.ok) {
        throw new Error(`Upstream returned ${upstream.status}`);
    }

    return upstream.arrayBuffer();
};

// POST /api/auth/register
export const register = async (c: Context<AppEnv>) => {
    const { email, password } = await c.req.json();
    if (!email || !password) {
        return c.json({ error: 'Email and password are required' }, 400);
    }
    if (password.length < 8) {
        return c.json({ error: 'Password must be at least 8 characters' }, 400);
    }
    try {
        const result = await registerUserService(email, password);
        return c.json({ message: result }, 201);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 400);
    }
};

// POST /api/auth/login
export const login = async (c: Context<AppEnv>) => {
    const { email, password } = await c.req.json();
    if (!email || !password) {
        return c.json({ error: 'Email and password are required' }, 400);
    }
    try {
        const token = await loginUserService(email, password, c.env.JWT_SECRET);
        return c.json({ token }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 401);
    }
};

// POST /api/auth/upload/hero — upload hero section image to Cloudinary and save URL
export const uploadHeroImage = async (c: Context<AppEnv>) => {
    const file = await readUploadedFile(c, 'heroImage', 'image');
    if (file instanceof Response) return file;

    try {
        const uploaded = await uploadFileToCloudinary(c.env, file, 'portfolio/hero', 'heroImage');
        const imageUrl = uploaded.secure_url;
        await db
            .insert(siteSettingsTable)
            .values({ key: 'heroImageUrl', value: imageUrl })
            .onConflictDoUpdate({
                target: siteSettingsTable.key,
                set: { value: imageUrl, updatedAt: new Date() },
            });
        return c.json({ message: 'Hero image uploaded successfully', imageUrl }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// GET /api/settings/hero — fetch the saved hero image URL
export const getHeroImageUrl = async (c: Context<AppEnv>) => {
    try {
        const setting = await db.query.siteSettingsTable.findFirst({
            where: (t, { eq }) => eq(t.key, 'heroImageUrl'),
        });
        if (!setting) {
            return c.json({ error: 'No hero image set yet' }, 404);
        }
        return c.json({ imageUrl: setting.value }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// POST /api/settings/resume — save resume URL (admin only)
export const setResumeUrl = async (c: Context<AppEnv>) => {
    const { url } = await c.req.json();
    if (!url) {
        return c.json({ error: 'url is required' }, 400);
    }
    try {
        await db
            .insert(siteSettingsTable)
            .values({ key: 'resumeUrl', value: url })
            .onConflictDoUpdate({
                target: siteSettingsTable.key,
                set: { value: url, updatedAt: new Date() },
            });
        return c.json({ message: 'Resume URL saved', url }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// GET /api/settings/resume — fetch resume URL (public)
export const getResumeUrl = async (c: Context<AppEnv>) => {
    try {
        const setting = await db.query.siteSettingsTable.findFirst({
            where: (t, { eq }) => eq(t.key, 'resumeUrl'),
        });
        if (!setting) {
            return c.json({ error: 'No resume URL set yet' }, 404);
        }
        return c.json({ url: normalizeResumeUrl(setting.value, c.env.CLOUDINARY_CLOUD_NAME) }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// POST /api/settings/tagline — save tagline (admin only)
export const setTagline = async (c: Context<AppEnv>) => {
    const { tagline } = await c.req.json();
    if (!tagline) {
        return c.json({ error: 'tagline is required' }, 400);
    }
    try {
        await db
            .insert(siteSettingsTable)
            .values({ key: 'tagline', value: tagline })
            .onConflictDoUpdate({
                target: siteSettingsTable.key,
                set: { value: tagline, updatedAt: new Date() },
            });
        return c.json({ message: 'Tagline saved', tagline }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// GET /api/settings/tagline — fetch tagline (public)
export const getTagline = async (c: Context<AppEnv>) => {
    try {
        const setting = await db.query.siteSettingsTable.findFirst({
            where: (t, { eq }) => eq(t.key, 'tagline'),
        });
        if (!setting) {
            return c.json({ error: 'No tagline set yet' }, 404);
        }
        return c.json({ tagline: setting.value }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// GET /api/settings — return all settings as a single object (public)
export const getAllSettings = async (c: Context<AppEnv>) => {
    try {
        const rows = await db.query.siteSettingsTable.findMany();
        const settings = rows.reduce((acc, row) => {
            acc[row.key] = row.key === 'resumeUrl' ? normalizeResumeUrl(row.value, c.env.CLOUDINARY_CLOUD_NAME) : row.value;
            return acc;
        }, {} as Record<string, string>);
        return c.json(settings, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// PUT /api/settings — batch-upsert any settings keys (admin only)
export const updateSettings = async (c: Context<AppEnv>) => {
    const updates = (await c.req.json()) as Record<string, string>;
    if (!updates || typeof updates !== 'object' || Array.isArray(updates) || Object.keys(updates).length === 0) {
        return c.json({ error: 'Body must be a non-empty object of key-value settings' }, 400);
    }
    try {
        for (const [key, value] of Object.entries(updates)) {
            await db
                .insert(siteSettingsTable)
                .values({ key, value: String(value) })
                .onConflictDoUpdate({
                    target: siteSettingsTable.key,
                    set: { value: String(value), updatedAt: new Date() },
                });
        }
        return c.json({ message: 'Settings updated', updated: Object.keys(updates) }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// POST /api/settings/resume/upload — upload PDF resume to Cloudinary (admin only)
export const uploadResumePdf = async (c: Context<AppEnv>) => {
    const file = await readUploadedFile(c, 'resume', 'pdf');
    if (file instanceof Response) return file;

    try {
        const uploaded = await uploadFileToCloudinary(c.env, file, 'portfolio/resumes', 'resume', 'raw');
        const pdfUrl = uploaded.secure_url;
        await db
            .insert(siteSettingsTable)
            .values({ key: 'resumeUrl', value: pdfUrl })
            .onConflictDoUpdate({
                target: siteSettingsTable.key,
                set: { value: pdfUrl, updatedAt: new Date() },
            });
        return c.json({ message: 'Resume uploaded successfully', url: pdfUrl }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 500);
    }
};

// GET /api/settings/resume/download — stream the stored PDF for download or inline preview
export const downloadResume = async (c: Context<AppEnv>, mode: 'attachment' | 'inline') => {
    try {
        const setting = await db.query.siteSettingsTable.findFirst({
            where: (t, { eq }) => eq(t.key, 'resumeUrl'),
        });
        const resumeUrl = setting?.value ? normalizeResumeUrl(setting.value, c.env.CLOUDINARY_CLOUD_NAME) : undefined;
        if (!resumeUrl) {
            return c.json({ error: 'Resume not found' }, 404);
        }

        const requestedMode = c.req.query('mode') === 'inline' ? 'inline' : mode;
        const bytes = await fetchResumeBytes(c, resumeUrl);

        return new Response(bytes, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `${requestedMode}; filename="resume.pdf"`,
                'Content-Length': String(bytes.byteLength),
            },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return c.json({ error: message }, 502);
    }
};
