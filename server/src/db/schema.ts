import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

// --- ADMIN ---
export const usersTable = pgTable('usersTable', {
    userId: serial('userId').primaryKey(),
    email: text('email').notNull().unique(),
    passwordHash: text('passwordHash').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
});

// --- PROJECTS ---
export const projectsTable = pgTable('projectsTable', {
    projectId: serial('projectId').primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(), // URL of the case study: /work/<slug>
    summary: text('summary'), // one or two lines for cards; description is the full write-up
    description: text('description').notNull(),
    techStack: text('techStack').array().notNull(),
    imageUrl: text('imageUrl'),
    liveUrl: text('liveUrl'),
    githubUrl: text('githubUrl'),
    featured: boolean('featured').default(false),
    order: integer('order').default(0),
    createdAt: timestamp('createdAt').defaultNow(),
});

// --- SKILLS ---
export const skillsTable = pgTable('skillsTable', {
    skillId: serial('skillId').primaryKey(),
    name: text('name').notNull(),
    category: text('category').notNull(), // e.g. Frontend, Backend, DevOps
    iconUrl: text('iconUrl'),
    order: integer('order').default(0),
});

// --- EXPERIENCE ---
export const experienceTable = pgTable('experienceTable', {
    experienceId: serial('experienceId').primaryKey(),
    company: text('company').notNull(),
    role: text('role').notNull(),
    location: text('location'),
    startDate: text('startDate').notNull(),
    endDate: text('endDate'),          // null means current job
    bullets: text('bullets').array(),   // list of responsibilities
    order: integer('order').default(0),
});

// --- TESTIMONIALS ---
export const testimonialsTable = pgTable('testimonialsTable', {
    testimonialId: serial('testimonialId').primaryKey(),
    name: text('name').notNull(),
    role: text('role').notNull(),
    avatarUrl: text('avatarUrl'),
    message: text('message').notNull(),
    rating: integer('rating').default(5),
    order: integer('order').default(0),
});

// --- CONTACT MESSAGES ---
export const contactMessagesTable = pgTable('contactMessagesTable', {
    contactMessageId: serial('contactMessageId').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    message: text('message').notNull(),
    read: boolean('read').default(false),
    createdAt: timestamp('createdAt').defaultNow(),
});

// --- EDUCATION ---
export const educationTable = pgTable('educationTable', {
    educationId: serial('educationId').primaryKey(),
    institution: text('institution').notNull(),
    degree: text('degree').notNull(),
    description: text('description'),
    logoUrl: text('logo_url'),
    startDate: text('start_date'),
    endDate: text('end_date'),           // null means ongoing
    order: integer('order').default(0),
});

// --- COMMUNITY ---
export const communityTable = pgTable('communityTable', {
    communityId: serial('communityId').primaryKey(),
    name: text('name').notNull(),
    role: text('role'),
    description: text('description'),
    logoUrl: text('logo_url'),
    bioUrl: text('bio_url'),             // the "My Bio" button link
    order: integer('order').default(0),
});

// --- SITE SETTINGS (hero image + other global config) ---
export const siteSettingsTable = pgTable('siteSettingsTable', {
    key: text('key').primaryKey(),       // e.g. 'heroImageUrl'
    value: text('value').notNull(),
    updatedAt: timestamp('updatedAt').defaultNow(),
});

// ============================================================================
// INFER TYPES FOR INSERT AND SELECT
// ============================================================================

// 1. Users (Admin)
export type TUserInsert = typeof usersTable.$inferInsert;
export type TUserSelect = typeof usersTable.$inferSelect;

// 2. Projects
export type TProjectInsert = typeof projectsTable.$inferInsert;
export type TProjectSelect = typeof projectsTable.$inferSelect;

// 3. Skills
export type TSkillInsert = typeof skillsTable.$inferInsert;
export type TSkillSelect = typeof skillsTable.$inferSelect;

// 4. Experience
export type TExperienceInsert = typeof experienceTable.$inferInsert;
export type TExperienceSelect = typeof experienceTable.$inferSelect;

// 5. Testimonials
export type TTestimonialInsert = typeof testimonialsTable.$inferInsert;
export type TTestimonialSelect = typeof testimonialsTable.$inferSelect;

// 6. Contact Messages
export type TContactMessageInsert = typeof contactMessagesTable.$inferInsert;
export type TContactMessageSelect = typeof contactMessagesTable.$inferSelect;

// 7. Education
export type TEducationInsert = typeof educationTable.$inferInsert;
export type TEducationSelect = typeof educationTable.$inferSelect;

// 8. Community
export type TCommunityInsert = typeof communityTable.$inferInsert;
export type TCommunitySelect = typeof communityTable.$inferSelect;

// 9. Site Settings
export type TSiteSettingInsert = typeof siteSettingsTable.$inferInsert;
export type TSiteSettingSelect = typeof siteSettingsTable.$inferSelect;

// ============================================================================
// TABLE RELATIONS
// ============================================================================

// Note: Most tables in this portfolio schema are independent and don't have
// foreign key relationships. Relations can be added later if needed
// (e.g., if you want to link projects to skills, or testimonials to projects).

// Example: If you want to add relations in the future, uncomment and modify:
// export const projectRelations = relations(projectsTable, ({ many }) => ({
//   skills: many(skillsTable), // would require a junction table
// }));