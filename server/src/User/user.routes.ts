import { Router } from 'express';
import { register, login, uploadHeroImage, getHeroImageUrl, setResumeUrl, getResumeUrl, setTagline, getTagline, getAllSettings, updateSettings, uploadResumePdf, downloadResume, previewResume } from './user.controller';
import { upload, uploadToCloudinary, uploadPdf } from '../Middleware/upload';
import { authenticate } from '../Middleware/auth';

export const UserRouter = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - "🔓 Auth (Public)"
 *     summary: Login — get a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginBody'
 *     responses:
 *       200:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
UserRouter.post('/auth/login', login);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - "🔐 Auth (Admin)"
 *     summary: Register a new admin account (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginBody'
 *     responses:
 *       201:
 *         description: Registered
 *       400:
 *         description: Email already registered or invalid input
 *       401:
 *         description: Unauthorized
 */
UserRouter.post('/auth/register', authenticate, register);

/**
 * @openapi
 * /auth/upload/hero:
 *   post:
 *     tags:
 *       - "🔐 Auth (Admin)"
 *     summary: Upload hero section image to Cloudinary
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               heroImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cloudinary URL returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImageUploadResponse'
 *       401:
 *         description: Unauthorized
 */
UserRouter.post('/auth/upload/hero', authenticate, upload.single('heroImage'), uploadToCloudinary('portfolio/hero'), uploadHeroImage);

/**
 * @openapi
 * /settings/hero:
 *   get:
 *     tags:
 *       - "🔓 Auth (Public)"
 *     summary: Get the current hero image URL
 *     responses:
 *       200:
 *         description: Hero image URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *       404:
 *         description: No hero image set yet
 */
UserRouter.get('/settings/hero', getHeroImageUrl);

/**
 * @openapi
 * /settings/resume:
 *   post:
 *     tags:
 *       - "🔐 Auth (Admin)"
 *     summary: Set the resume URL
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resume URL saved
 *       401:
 *         description: Unauthorized
 *   get:
 *     tags:
 *       - "🔓 Auth (Public)"
 *     summary: Get the resume URL
 *     responses:
 *       200:
 *         description: Resume URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *       404:
 *         description: No resume URL set yet
 */
UserRouter.post('/settings/resume', authenticate, setResumeUrl);
UserRouter.get('/settings/resume', getResumeUrl);
UserRouter.get('/settings/resume/download', downloadResume);
UserRouter.get('/settings/resume/preview', previewResume);

/**
 * @openapi
 * /settings/tagline:
 *   post:
 *     tags:
 *       - "🔐 Auth (Admin)"
 *     summary: Set the hero section tagline
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tagline:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tagline saved
 *       401:
 *         description: Unauthorized
 *   get:
 *     tags:
 *       - "🔓 Auth (Public)"
 *     summary: Get the hero section tagline
 *     responses:
 *       200:
 *         description: Tagline text
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tagline:
 *                   type: string
 *       404:
 *         description: No tagline set yet
 */
UserRouter.post('/settings/tagline', authenticate, setTagline);
UserRouter.get('/settings/tagline', getTagline);

/**
 * @openapi
 * /settings:
 *   get:
 *     tags:
 *       - "🔓 Auth (Public)"
 *     summary: Get all site settings as a single object
 *     responses:
 *       200:
 *         description: All settings (tagline, heroImageUrl, resumeUrl, githubUrl, linkedinUrl, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: string
 *   put:
 *     tags:
 *       - "🔐 Auth (Admin)"
 *     summary: Batch-update any site settings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties:
 *               type: string
 *             example:
 *               tagline: "Full-Stack Developer"
 *               githubUrl: "https://github.com/username"
 *               linkedinUrl: "https://linkedin.com/in/username"
 *     responses:
 *       200:
 *         description: Settings updated
 *       401:
 *         description: Unauthorized
 */
UserRouter.get('/settings', getAllSettings);
UserRouter.put('/settings', authenticate, updateSettings);

/**
 * @openapi
 * /settings/resume/upload:
 *   post:
 *     tags:
 *       - "🔐 Auth (Admin)"
 *     summary: Upload PDF resume to Cloudinary
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
UserRouter.post('/settings/resume/upload', authenticate, uploadPdf.single('resume'), uploadToCloudinary('portfolio/resumes', 'raw'), uploadResumePdf);