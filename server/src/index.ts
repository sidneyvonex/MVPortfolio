import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { AppEnv } from './types/env';

import { UserRouter } from './User/user.routes';
import { ProjectsRouter } from './Projects/projects.routes';
import { SkillsRouter } from './Skills/skills.routes';
import { ExperienceRouter } from './Experience/experience.routes';
import { TestimonialsRouter } from './Testimonials/Testimonials.routes';
import { ContactRouter } from './Contact/contact.routes';
import { EducationRouter } from './Education/education.routes';
import { CommunityRouter } from './Community/community.routes';
import { PublishRouter } from './Publish/publish.routes';
import openapiSpec from './openapi.json';

const SWAGGER_UI_HTML = `<!DOCTYPE html>
<html>
<head>
  <title>Portfolio API Docs</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.min.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({ url: '/api/docs.json', dom_id: '#swagger-ui', persistAuthorization: true });
    };
  </script>
</body>
</html>`;

const app = new Hono<AppEnv>();

app.use('/api/*', async (c, next) => {
    const allowedOrigins = c.env.CLIENT_URL.split(',').map((o) => o.trim());
    const corsMiddleware = cors({
        origin: (origin) => (allowedOrigins.includes(origin) ? origin : null),
    });
    return corsMiddleware(c, next);
});

app.get('/api/health', (c) => c.json({ status: 'Server is running' }));

app.get('/api/docs.json', (c) => c.json(openapiSpec));
app.get('/api/docs', (c) => c.html(SWAGGER_UI_HTML));

app.route('/api', UserRouter);
app.route('/api', ProjectsRouter);
app.route('/api', SkillsRouter);
app.route('/api', ExperienceRouter);
app.route('/api', TestimonialsRouter);
app.route('/api', ContactRouter);
app.route('/api', EducationRouter);
app.route('/api', CommunityRouter);
app.route('/api', PublishRouter);

export default app;
