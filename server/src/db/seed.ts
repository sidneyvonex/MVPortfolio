import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const db = drizzle(process.env.DATABASE_URL!, { schema });

async function seed() {
    console.log("🌱 Seeding demo data...\n");

    // ── PROJECTS ────────────────────────────────────────────────────
    const projects = await db.insert(schema.projectsTable).values([
        {
            title: "Portfolio Website",
            slug: "portfolio-website",
            summary: "Personal portfolio with its own admin panel for every piece of content.",
            description: "A full-stack personal portfolio built with React, TypeScript, Express and Neon PostgreSQL. Features a CMS-style admin panel for managing all content.",
            techStack: ["React", "TypeScript", "Express", "PostgreSQL", "Drizzle ORM", "Cloudinary"],
            liveUrl: "https://yourdomain.com",
            githubUrl: "https://github.com/yourhandle/portfolio",
            featured: true,
            order: 1,
        },
        {
            title: "E-Commerce Platform",
            slug: "e-commerce-platform",
            summary: "Online store with product management, checkout and card payments.",
            description: "A scalable online store with product management, cart, checkout, and Stripe payment integration. Built with Next.js and a headless CMS.",
            techStack: ["Next.js", "Stripe", "Tailwind CSS", "Prisma", "PostgreSQL"],
            liveUrl: "https://shop.yourdomain.com",
            githubUrl: "https://github.com/yourhandle/ecommerce",
            featured: true,
            order: 2,
        },
        {
            title: "Task Management App",
            slug: "task-management-app",
            summary: "Kanban board with real-time updates and drag and drop.",
            description: "A Kanban-style task board with real-time updates via WebSockets, drag-and-drop, and team collaboration features.",
            techStack: ["React", "Node.js", "Socket.io", "MongoDB", "Express"],
            githubUrl: "https://github.com/yourhandle/taskboard",
            featured: false,
            order: 3,
        },
        {
            title: "Weather Dashboard",
            slug: "weather-dashboard",
            summary: "Seven-day forecasts drawn as animated charts.",
            description: "A weather app that visualises 7-day forecasts with animated charts using the OpenWeather API.",
            techStack: ["Vue.js", "Chart.js", "OpenWeather API", "Vite"],
            liveUrl: "https://weather.yourdomain.com",
            githubUrl: "https://github.com/yourhandle/weather",
            featured: false,
            order: 4,
        },
    ]).returning();
    console.log(`✅ Projects seeded: ${projects.length}`);

    // ── SKILLS ──────────────────────────────────────────────────────
    const skills = await db.insert(schema.skillsTable).values([
        { name: "TypeScript", category: "Frontend", order: 1 },
        { name: "React", category: "Frontend", order: 2 },
        { name: "Next.js", category: "Frontend", order: 3 },
        { name: "Tailwind CSS", category: "Frontend", order: 4 },
        { name: "Node.js", category: "Backend", order: 5 },
        { name: "Express", category: "Backend", order: 6 },
        { name: "PostgreSQL", category: "Backend", order: 7 },
        { name: "Drizzle ORM", category: "Backend", order: 8 },
        { name: "Docker", category: "DevOps", order: 9 },
        { name: "GitHub Actions", category: "DevOps", order: 10 },
        { name: "Cloudinary", category: "Tools", order: 11 },
        { name: "Figma", category: "Tools", order: 12 },
    ]).returning();
    console.log(`✅ Skills seeded: ${skills.length}`);

    // ── EXPERIENCE ──────────────────────────────────────────────────
    const experience = await db.insert(schema.experienceTable).values([
        {
            company: "Tech Startup Ltd",
            role: "Full Stack Developer",
            location: "Nairobi, Kenya",
            startDate: "2024-01",
            endDate: null, // current job
            bullets: [
                "Built and maintained REST APIs serving 10k+ daily active users",
                "Reduced page load time by 40% through code splitting and caching",
                "Led migration of legacy jQuery codebase to React",
            ],
            order: 1,
        },
        {
            company: "Freelance",
            role: "Frontend Developer",
            location: "Remote",
            startDate: "2022-06",
            endDate: "2023-12",
            bullets: [
                "Delivered 8 client projects on time and within budget",
                "Built responsive landing pages and dashboards for SMEs",
                "Integrated payment gateways (M-Pesa, Stripe) for e-commerce clients",
            ],
            order: 2,
        },
        {
            company: "Digital Agency Co.",
            role: "Junior Developer",
            location: "Nairobi, Kenya",
            startDate: "2021-03",
            endDate: "2022-05",
            bullets: [
                "Collaborated with designers to implement pixel-perfect UIs",
                "Maintained WordPress sites and custom PHP plugins",
                "Introduced Git workflow to the team",
            ],
            order: 3,
        },
    ]).returning();
    console.log(`✅ Experience seeded: ${experience.length}`);

    // ── TESTIMONIALS ────────────────────────────────────────────────
    const testimonials = await db.insert(schema.testimonialsTable).values([
        {
            name: "Alice Mwangi",
            role: "CEO, Startup Ltd",
            message: "Sidney delivered our platform on time and exceeded every expectation. The code quality and communication were exceptional.",
            rating: 5,
            order: 1,
        },
        {
            name: "Brian Otieno",
            role: "Product Manager, Digital Agency",
            message: "Working with Sidney was a pleasure. He quickly understood our requirements and proposed smart solutions we hadn't considered.",
            rating: 5,
            order: 2,
        },
        {
            name: "Carol Njeri",
            role: "Founder, E-Shop Kenya",
            message: "Our online store went from idea to live in 3 weeks. Sidney's attention to detail and speed was impressive.",
            rating: 5,
            order: 3,
        },
    ]).returning();
    console.log(`✅ Testimonials seeded: ${testimonials.length}`);

    // ── CONTACT MESSAGES ────────────────────────────────────────────
    const messages = await db.insert(schema.contactMessagesTable).values([
        {
            name: "David Kamau",
            email: "david@example.com",
            message: "Hi, I have a project idea I'd love to discuss with you. Are you available for a call next week?",
            read: false,
        },
        {
            name: "Emma Wanjiru",
            email: "emma@example.com",
            message: "Love your portfolio! I'm looking for a developer to build a booking system. Let's connect.",
            read: true,
        },
    ]).returning();
    console.log(`✅ Contact messages seeded: ${messages.length}`);

    // ── EDUCATION ───────────────────────────────────────────────────
    const education = await db.insert(schema.educationTable).values([
        {
            institution: "University of Nairobi",
            degree: "BSc. Computer Science",
            description: "Focused on software engineering, algorithms and data structures, and distributed systems.",
            startDate: "2018-09",
            endDate: "2022-06",
            order: 1,
        },
        {
            institution: "ALX Africa",
            degree: "Software Engineering Programme",
            description: "Intensive 12-month programme covering full-stack development, DevOps, and professional skills.",
            startDate: "2022-09",
            endDate: "2023-09",
            order: 2,
        },
        {
            institution: "freeCodeCamp",
            degree: "Responsive Web Design Certification",
            description: "HTML, CSS, accessibility, and responsive design principles.",
            startDate: "2020-01",
            endDate: "2020-04",
            order: 3,
        },
    ]).returning();
    console.log(`✅ Education seeded: ${education.length}`);

    // ── COMMUNITY ───────────────────────────────────────────────────
    const community = await db.insert(schema.communityTable).values([
        {
            name: "Nairobi Tech Community",
            role: "Co-organiser",
            description: "A community of 2000+ developers in Nairobi. I help organise monthly meetups, workshops, and hackathons.",
            order: 1,
        },
        {
            name: "ALX Africa Alumni Network",
            role: "Mentor",
            description: "Volunteer mentor supporting new cohorts through their software engineering journey.",
            order: 2,
        },
        {
            name: "freeCodeCamp Nairobi",
            role: "Study Group Lead",
            description: "Running weekly study sessions and coding challenges for beginners learning web development.",
            order: 3,
        },
    ]).returning();
    console.log(`✅ Community seeded: ${community.length}`);

    console.log("\n🎉 All demo data seeded successfully!");
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
});
