import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { fadeInLeft, fadeInUp, staggerContainer } from '../../lib/animations';
import { Experience } from '../../types';
import { api } from '../../services/api';

const fallbackExperience: Experience[] = [
  {
    experienceId: 1,
    company: 'Teach2Give',
    role: 'Software Engineering Attache',
    location: 'Laikipia, Kenya',
    startDate: 'May 2024',
    endDate: 'July 2024',
    bullets: [
      'Developed and deployed full-stack applications using React, TypeScript, Express.js, and PostgreSQL',
      'Implemented secure authentication with JWT and wrote unit tests with Jest',
      'Collaborated in agile teams, contributing to UI/UX design in Figma and API integration',
      'Gained hands-on experience in frontend, backend, and DevOps workflows',
    ],
    order: 1,
  },
];

const floatingSymbols = [
  { text: '{ }',      x: '3%',  y: '8%',  size: 'text-6xl',  delay: 0    },
  { text: '</>',      x: '85%', y: '6%',  size: 'text-6xl',  delay: 0.8  },
  { text: '=>',       x: '72%', y: '25%', size: 'text-7xl',  delay: 1.6  },
  { text: '//',       x: '12%', y: '48%', size: 'text-6xl',  delay: 0.4  },
  { text: '[ ]',      x: '88%', y: '55%', size: 'text-6xl',  delay: 2.1  },
  { text: 'const',    x: '55%', y: '75%', size: 'text-5xl',  delay: 1.2  },
  { text: '&&',       x: '25%', y: '82%', size: 'text-7xl',  delay: 0.6  },
  { text: '===',      x: '6%',  y: '75%', size: 'text-5xl',  delay: 1.9  },
  { text: '()',       x: '46%', y: '10%', size: 'text-7xl',  delay: 2.5  },
  { text: '=>',       x: '35%', y: '38%', size: 'text-5xl',  delay: 3.0  },
  { text: 'import',   x: '62%', y: '42%', size: 'text-4xl',  delay: 1.4  },
  { text: 'async',    x: '18%', y: '22%', size: 'text-5xl',  delay: 2.2  },
  { text: '??',       x: '78%', y: '70%', size: 'text-6xl',  delay: 0.9  },
  { text: 'return',   x: '42%', y: '60%', size: 'text-4xl',  delay: 1.7  },
  { text: '||',       x: '93%', y: '35%', size: 'text-6xl',  delay: 3.3  },
  { text: 'null',     x: '8%',  y: '35%', size: 'text-4xl',  delay: 2.8  },
  { text: '.map()',   x: '65%', y: '88%', size: 'text-4xl',  delay: 0.3  },
  { text: '#',        x: '48%', y: '90%', size: 'text-7xl',  delay: 1.0  },
  { text: 'type',     x: '30%', y: '15%', size: 'text-4xl',  delay: 2.0  },
  { text: '{ }',      x: '80%', y: '82%', size: 'text-5xl',  delay: 3.5  },
];

const Resume = () => {
  const { data: experienceData } = useQuery({
    queryKey: ['experience'],
    queryFn: api.experience.getAll,
  });

  const experiences = (experienceData as Experience[]) ?? fallbackExperience;

  return (
    <section id="resume" className="relative min-h-screen bg-[#F4F6FF] section-padding overflow-hidden">

      {/* Dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, #1A56FF18 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Floating code symbols */}
      {floatingSymbols.map((s, i) => (
        <motion.span
          key={i}
          className={`absolute font-mono font-bold text-[#1A56FF]/20 select-none pointer-events-none ${s.size}`}
          style={{ left: s.x, top: s.y }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.2, 0.28, 0.2],
          }}
          transition={{
            duration: 5 + i * 0.7,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {s.text}
        </motion.span>
      ))}

      <div className="relative max-w-7xl mx-auto">

        {/* Section Heading */}
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="w-12 h-1 bg-[#1A56FF] rounded-full" />
          <h2 className="section-heading">Work Experience</h2>
        </motion.div>
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-body text-[#8892A4] mb-16 ml-16"
        >
          Where I have worked and what I built there
        </motion.p>

        {/* Timeline */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative max-w-3xl"
        >
          {/* Vertical rule */}
          <div className="absolute left-5 top-0 bottom-0 w-px
                          bg-linear-to-b from-[#1A56FF]/50 via-[#1A56FF]/20
                          to-transparent" />

          {experiences.map((exp, i) => (
            <motion.div
              key={exp.experienceId}
              variants={fadeInUp}
              className="relative pl-16 mb-10 last:mb-0"
            >
              {/* Dot */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: 'spring', stiffness: 300 }}
                className="absolute left-5 top-5 w-4 h-4 rounded-full
                           bg-[#1A56FF] border-[3px] border-white shadow-md
                           -translate-x-1/2"
              />

              {/* Card */}
              <motion.div
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-6 border border-gray-100
                           hover:border-[#1A56FF]/20 hover:shadow-lg
                           transition-all duration-300"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h4 className="font-heading font-bold text-[#0A0A0F] text-lg">
                      {exp.role}
                    </h4>
                    <p className="font-body text-[#1A56FF] font-semibold text-sm mt-0.5">
                      {exp.company}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 bg-[#1A56FF]/10
                                  text-[#1A56FF] text-xs font-mono font-medium
                                  px-3 py-1.5 rounded-full">
                    <Briefcase size={11} />
                    Full-time
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <span className="flex items-center gap-1.5 text-[#8892A4] text-xs font-body">
                    <Calendar size={12} className="text-[#1A56FF]" />
                    {exp.startDate} — {exp.endDate ?? 'Present'}
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1.5 text-[#8892A4] text-xs font-body">
                      <MapPin size={12} className="text-[#1A56FF]" />
                      {exp.location}
                    </span>
                  )}
                </div>

                {/* Bullets */}
                {exp.bullets && (
                  <ul className="flex flex-col gap-2 border-t border-gray-50 pt-4">
                    {exp.bullets.map((bullet, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <CheckCircle2 size={13} className="text-[#1A56FF] shrink-0 mt-0.5" />
                        <span className="font-body text-[#8892A4] text-sm leading-relaxed">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Resume;
