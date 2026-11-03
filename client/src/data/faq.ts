// Questions people ask before getting in touch. Shown on /faq and given to search engines as
// FAQPage structured data, so the answers can appear in results. Plain data only.

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: 'Where are you based, and do you work remotely?',
    a: 'I am based in Kenya and work with clients and teams both locally and remotely. Most collaboration happens over chat, calls and a shared repository, so location rarely matters.',
  },
  {
    q: 'What kind of work do you take on?',
    a: 'Websites, web apps, mobile apps and custom platforms built for clients, and collaboration work with other developers: joining projects, hackathons, short sprints and short-term contracts.',
  },
  {
    q: 'How does a project start?',
    a: 'With a conversation about what you want to build and why. I then suggest a first step, usually a small, clearly defined piece of work, so you can see how we work together before committing to more.',
  },
  {
    q: 'How do you price work?',
    a: 'Defined projects get a fixed quote once the scope is clear. Sprints and contracts are priced by time. Either way, you know the cost before any work starts.',
  },
  {
    q: 'What technologies do you use?',
    a: 'Mostly TypeScript, React and Node.js, with PostgreSQL for data and Cloudflare for hosting. I pick tools that suit the project and that your team can maintain after I finish.',
  },
  {
    q: 'Can you join a hackathon team?',
    a: 'Yes. Tell me the event, the dates and who is on the team so far, and I will let you know if I can make it.',
  },
  {
    q: 'What happens after launch?',
    a: 'You own the code and the accounts. I can stay on for fixes and improvements, or hand over with notes so your team can take it from there.',
  },
];
