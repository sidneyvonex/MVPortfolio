// Build-time OpenAPI spec generator.
//
// swagger-jsdoc needs filesystem access to scan comment blocks, which the Worker
// runtime doesn't have. So instead of generating the spec on every request (like
// the old Express setup did), this script runs once during `npm run build` and
// writes a static src/openapi.json that the Worker serves as-is.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const bearerAuth = { bearerAuth: [] as string[] };

const listGet = (tag: string, schemaRef: string) => ({
    get: {
        tags: [`🔓 ${tag} (Public)`],
        summary: `Get all ${tag.toLowerCase()} entries`,
        responses: { 200: { description: 'List', content: { 'application/json': { schema: { type: 'array', items: { $ref: `#/components/schemas/${schemaRef}` } } } } } },
    },
});

const byIdGet = (tag: string, schemaRef: string, param: string) => ({
    get: {
        tags: [`🔓 ${tag} (Public)`],
        summary: `Get a ${tag.toLowerCase()} entry by ID`,
        parameters: [{ name: param, in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
            200: { description: tag, content: { 'application/json': { schema: { $ref: `#/components/schemas/${schemaRef}` } } } },
            404: { description: 'Not found' },
        },
    },
});

const create = (tag: string, bodyRef: string) => ({
    post: {
        tags: [`🔐 ${tag} (Admin)`],
        summary: `Create a ${tag.toLowerCase()} entry`,
        security: [bearerAuth],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: `#/components/schemas/${bodyRef}` } } } },
        responses: { 201: { description: 'Created' }, 401: { description: 'Unauthorized' } },
    },
});

const update = (tag: string, bodyRef: string, param: string) => ({
    put: {
        tags: [`🔐 ${tag} (Admin)`],
        summary: `Update a ${tag.toLowerCase()} entry`,
        security: [bearerAuth],
        parameters: [{ name: param, in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: `#/components/schemas/${bodyRef}` } } } },
        responses: { 200: { description: 'Updated' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
    },
});

const remove = (tag: string, param: string) => ({
    delete: {
        tags: [`🔐 ${tag} (Admin)`],
        summary: `Delete a ${tag.toLowerCase()} entry`,
        security: [bearerAuth],
        parameters: [{ name: param, in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Deleted' }, 401: { description: 'Unauthorized' } },
    },
});

const imageUpload = (tag: string, param: string, field: string) => ({
    post: {
        tags: [`🔐 ${tag} (Admin)`],
        summary: `Upload ${field} to Cloudinary`,
        security: [bearerAuth],
        parameters: [{ name: param, in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { [field]: { type: 'string', format: 'binary' } } } } } },
        responses: { 200: { description: `${field} URL`, content: { 'application/json': { schema: { $ref: '#/components/schemas/ImageUploadResponse' } } } }, 401: { description: 'Unauthorized' } },
    },
});

const merge = (...objs: object[]) => Object.assign({}, ...objs);

const spec = {
    openapi: '3.0.0',
    info: {
        title: 'Portfolio API',
        version: '1.0.0',
        description: `
## Portfolio Backend API

All **Admin** endpoints require a Bearer token in the Authorization header.

Get a token by calling \`POST /api/auth/login\`.

**Public** — No authentication required
**Admin** — Requires \`Authorization: Bearer <token>\`
        `,
    },
    servers: [{ url: '/api', description: 'API base path' }],
    components: {
        securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
        schemas: {
            LoginBody: {
                type: 'object', required: ['email', 'password'],
                properties: { email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 8 } },
            },
            Project: {
                type: 'object',
                properties: {
                    projectId: { type: 'integer' }, title: { type: 'string' }, slug: { type: 'string' },
                    summary: { type: 'string', nullable: true }, description: { type: 'string' },
                    techStack: { type: 'array', items: { type: 'string' } }, imageUrl: { type: 'string', nullable: true },
                    liveUrl: { type: 'string', nullable: true }, githubUrl: { type: 'string', nullable: true },
                    featured: { type: 'boolean' }, order: { type: 'integer' }, createdAt: { type: 'string', format: 'date-time', nullable: true },
                },
            },
            ProjectBody: {
                type: 'object', required: ['title', 'description', 'techStack'],
                properties: {
                    title: { type: 'string' }, description: { type: 'string' },
                    slug: { type: 'string', description: 'Optional; made from the title when empty, with -2, -3 added if taken' },
                    summary: { type: 'string', description: 'One or two lines for project cards' },
                    techStack: { type: 'string', description: 'Comma-separated or JSON array' },
                    imageUrl: { type: 'string' }, liveUrl: { type: 'string' }, githubUrl: { type: 'string' },
                    featured: { type: 'boolean' }, order: { type: 'integer' },
                },
            },
            Skill: {
                type: 'object',
                properties: { skillId: { type: 'integer' }, name: { type: 'string' }, category: { type: 'string' }, iconUrl: { type: 'string', nullable: true }, order: { type: 'integer' } },
            },
            SkillBody: {
                type: 'object', required: ['name', 'category'],
                properties: { name: { type: 'string' }, category: { type: 'string' }, iconUrl: { type: 'string' }, order: { type: 'integer' } },
            },
            Experience: {
                type: 'object',
                properties: {
                    experienceId: { type: 'integer' }, company: { type: 'string' }, role: { type: 'string' },
                    location: { type: 'string', nullable: true }, startDate: { type: 'string' },
                    endDate: { type: 'string', nullable: true, description: 'null = current job' },
                    bullets: { type: 'array', items: { type: 'string' }, nullable: true }, order: { type: 'integer' },
                },
            },
            ExperienceBody: {
                type: 'object', required: ['company', 'role', 'startDate'],
                properties: {
                    company: { type: 'string' }, role: { type: 'string' }, location: { type: 'string' },
                    startDate: { type: 'string' }, endDate: { type: 'string' },
                    bullets: { type: 'array', items: { type: 'string' } }, order: { type: 'integer' },
                },
            },
            Testimonial: {
                type: 'object',
                properties: {
                    testimonialId: { type: 'integer' }, name: { type: 'string' }, role: { type: 'string' },
                    avatarUrl: { type: 'string', nullable: true }, message: { type: 'string' },
                    rating: { type: 'integer', minimum: 1, maximum: 5 }, order: { type: 'integer' },
                },
            },
            TestimonialBody: {
                type: 'object', required: ['name', 'role', 'message'],
                properties: {
                    name: { type: 'string' }, role: { type: 'string' }, avatarUrl: { type: 'string' },
                    message: { type: 'string' }, rating: { type: 'integer', minimum: 1, maximum: 5 }, order: { type: 'integer' },
                },
            },
            ContactMessage: {
                type: 'object',
                properties: {
                    contactMessageId: { type: 'integer' }, name: { type: 'string' }, email: { type: 'string', format: 'email' },
                    message: { type: 'string' }, read: { type: 'boolean' }, createdAt: { type: 'string', format: 'date-time', nullable: true },
                },
            },
            ContactBody: {
                type: 'object', required: ['name', 'email', 'message'],
                properties: { name: { type: 'string' }, email: { type: 'string', format: 'email' }, message: { type: 'string' } },
            },
            Education: {
                type: 'object',
                properties: {
                    educationId: { type: 'integer' }, institution: { type: 'string' }, degree: { type: 'string' },
                    description: { type: 'string', nullable: true }, logoUrl: { type: 'string', nullable: true },
                    startDate: { type: 'string', nullable: true }, endDate: { type: 'string', nullable: true }, order: { type: 'integer' },
                },
            },
            EducationBody: {
                type: 'object', required: ['institution', 'degree'],
                properties: {
                    institution: { type: 'string' }, degree: { type: 'string' }, description: { type: 'string' },
                    logoUrl: { type: 'string' }, startDate: { type: 'string' }, endDate: { type: 'string' }, order: { type: 'integer' },
                },
            },
            Community: {
                type: 'object',
                properties: {
                    communityId: { type: 'integer' }, name: { type: 'string' }, role: { type: 'string', nullable: true },
                    description: { type: 'string', nullable: true }, logoUrl: { type: 'string', nullable: true },
                    bioUrl: { type: 'string', nullable: true }, order: { type: 'integer' },
                },
            },
            CommunityBody: {
                type: 'object', required: ['name'],
                properties: {
                    name: { type: 'string' }, role: { type: 'string' }, description: { type: 'string' },
                    logoUrl: { type: 'string' }, bioUrl: { type: 'string' }, order: { type: 'integer' },
                },
            },
            MessageResponse: { type: 'object', properties: { message: { type: 'string' } } },
            ErrorResponse: { type: 'object', properties: { error: { type: 'string' } } },
            ImageUploadResponse: { type: 'object', properties: { message: { type: 'string' }, imageUrl: { type: 'string', description: 'Cloudinary URL' } } },
        },
    },
    paths: {
        '/auth/login': { post: { tags: ['🔓 Auth (Public)'], summary: 'Login — get a JWT token', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginBody' } } } }, responses: { 200: { description: 'JWT token' }, 401: { description: 'Invalid credentials' } } } },
        '/auth/register': { post: { tags: ['🔐 Auth (Admin)'], summary: 'Register a new admin account (admin only)', security: [bearerAuth], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginBody' } } } }, responses: { 201: { description: 'Registered' }, 400: { description: 'Email already registered or invalid input' }, 401: { description: 'Unauthorized' } } } },
        '/auth/upload/hero': imageUpload('Auth', 'heroImage', 'heroImage'),
        '/settings/hero': { get: { tags: ['🔓 Auth (Public)'], summary: 'Get the current hero image URL', responses: { 200: { description: 'Hero image URL' }, 404: { description: 'No hero image set yet' } } } },
        '/settings/resume': {
            post: { tags: ['🔐 Auth (Admin)'], summary: 'Set the resume URL', security: [bearerAuth], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { url: { type: 'string' } } } } } }, responses: { 200: { description: 'Resume URL saved' }, 401: { description: 'Unauthorized' } } },
            get: { tags: ['🔓 Auth (Public)'], summary: 'Get the resume URL', responses: { 200: { description: 'Resume URL' }, 404: { description: 'No resume URL set yet' } } },
        },
        '/settings/resume/download': { get: { tags: ['🔓 Auth (Public)'], summary: 'Download the stored resume PDF', responses: { 200: { description: 'PDF bytes' } } } },
        '/settings/resume/preview': { get: { tags: ['🔓 Auth (Public)'], summary: 'Inline-preview the stored resume PDF', responses: { 200: { description: 'PDF bytes' } } } },
        '/settings/resume/upload': imageUpload('Auth', 'resume', 'resume'),
        '/settings/tagline': {
            post: { tags: ['🔐 Auth (Admin)'], summary: 'Set the hero section tagline', security: [bearerAuth], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { tagline: { type: 'string' } } } } } }, responses: { 200: { description: 'Tagline saved' }, 401: { description: 'Unauthorized' } } },
            get: { tags: ['🔓 Auth (Public)'], summary: 'Get the hero section tagline', responses: { 200: { description: 'Tagline text' }, 404: { description: 'No tagline set yet' } } },
        },
        '/settings': {
            get: { tags: ['🔓 Auth (Public)'], summary: 'Get all site settings as a single object', responses: { 200: { description: 'All settings' } } },
            put: { tags: ['🔐 Auth (Admin)'], summary: 'Batch-update any site settings', security: [bearerAuth], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', additionalProperties: { type: 'string' } } } } }, responses: { 200: { description: 'Settings updated' }, 401: { description: 'Unauthorized' } } },
        },
        '/projects': merge(listGet('Projects', 'Project'), create('Projects', 'ProjectBody')),
        '/projects/featured': { get: { tags: ['🔓 Projects (Public)'], summary: 'Get featured projects only', responses: { 200: { description: 'List of featured projects' } } } },
        '/projects/slug/{slug}': { get: { tags: ['🔓 Projects (Public)'], summary: 'Get a project by its slug', parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Project', content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } } }, 404: { description: 'Project not found' } } } },
        '/projects/{projectId}': merge(byIdGet('Projects', 'Project', 'projectId'), update('Projects', 'ProjectBody', 'projectId'), remove('Projects', 'projectId')),
        '/projects/{projectId}/image': imageUpload('Projects', 'projectId', 'image'),
        '/projects/{projectId}/featured': { patch: { tags: ['🔐 Projects (Admin)'], summary: 'Toggle featured flag on a project', security: [bearerAuth], parameters: [{ name: 'projectId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Featured status toggled' }, 401: { description: 'Unauthorized' }, 404: { description: 'Project not found' } } } },
        '/skills': merge(listGet('Skills', 'Skill'), create('Skills', 'SkillBody')),
        '/skills/{skillId}': merge(byIdGet('Skills', 'Skill', 'skillId'), update('Skills', 'SkillBody', 'skillId'), remove('Skills', 'skillId')),
        '/skills/{skillId}/icon': imageUpload('Skills', 'skillId', 'icon'),
        '/experience': merge(listGet('Experience', 'Experience'), create('Experience', 'ExperienceBody')),
        '/experience/{experienceId}': merge(byIdGet('Experience', 'Experience', 'experienceId'), update('Experience', 'ExperienceBody', 'experienceId'), remove('Experience', 'experienceId')),
        '/testimonials': merge(listGet('Testimonials', 'Testimonial'), create('Testimonials', 'TestimonialBody')),
        '/testimonials/{testimonialId}': merge(byIdGet('Testimonials', 'Testimonial', 'testimonialId'), update('Testimonials', 'TestimonialBody', 'testimonialId'), remove('Testimonials', 'testimonialId')),
        '/testimonials/{testimonialId}/avatar': imageUpload('Testimonials', 'testimonialId', 'avatar'),
        '/education': merge(listGet('Education', 'Education'), create('Education', 'EducationBody')),
        '/education/{educationId}': merge(byIdGet('Education', 'Education', 'educationId'), update('Education', 'EducationBody', 'educationId'), remove('Education', 'educationId')),
        '/education/{educationId}/logo': imageUpload('Education', 'educationId', 'logo'),
        '/communities': merge(listGet('Community', 'Community'), create('Community', 'CommunityBody')),
        '/communities/{communityId}': merge(byIdGet('Community', 'Community', 'communityId'), update('Community', 'CommunityBody', 'communityId'), remove('Community', 'communityId')),
        '/communities/{communityId}/logo': imageUpload('Community', 'communityId', 'logo'),
        '/contact': {
            post: { tags: ['🔓 Contact (Public)'], summary: 'Submit a contact message', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactBody' } } } }, responses: { 201: { description: 'Message sent' }, 400: { description: 'Missing fields' } } },
            get: { tags: ['🔐 Contact (Admin)'], summary: 'Get all contact messages', security: [bearerAuth], responses: { 200: { description: 'List' }, 401: { description: 'Unauthorized' } } },
        },
        '/contact/{contactMessageId}': {
            get: { tags: ['🔐 Contact (Admin)'], summary: 'Get a message by ID', security: [bearerAuth], parameters: [{ name: 'contactMessageId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Message' }, 404: { description: 'Not found' }, 401: { description: 'Unauthorized' } } },
            delete: remove('Contact', 'contactMessageId').delete,
        },
        '/contact/{contactMessageId}/read': { patch: { tags: ['🔐 Contact (Admin)'], summary: 'Mark a message as read', security: [bearerAuth], parameters: [{ name: 'contactMessageId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Marked as read' }, 401: { description: 'Unauthorized' } } } },
    },
};

const outPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/openapi.json');
writeFileSync(outPath, JSON.stringify(spec, null, 2));
console.log(`OpenAPI spec written to ${outPath}`);
