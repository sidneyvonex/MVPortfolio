import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart, Terminal } from 'lucide-react';
import { fadeInUp } from '../../lib/animations';
import { sections } from '../../hooks/useActiveSection';
import { api } from '../../services/api';
import type { SettingsMap } from '../../services/adminApi';

const Footer = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const { data: settings } = useQuery<SettingsMap>({
    queryKey: ['settings'],
    queryFn: () => api.settings.get() as Promise<SettingsMap>,
  });

  return (
    <footer className="bg-[#0A0A0F] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            <h3 className="font-heading font-bold text-2xl">
                            <span
              className={`flex items-center justify-center w-8 h-8 rounded-lg text-white text-xs font-bold
                bg-gradient-to-br from-[#1A56FF] to-[#0D2DB4] shadow-md`}
            >
              <Terminal size={14} />
            </span>
              Code<span className="text-[#1A56FF]">Sidney</span>
            </h3>
            <p className="font-body text-white/50 text-sm leading-relaxed">
              Full Stack Developer based in Kenya.
              Building scalable web applications
              from frontend to backend.
            </p>
            <div className="flex gap-3 mt-2">
              {[
                { id: 'github',   icon: Github,   href: settings?.githubUrl || '#' },
                { id: 'linkedin', icon: Linkedin, href: settings?.linkedinUrl || '#' },
                { id: 'mail',     icon: Mail,     href: settings?.email ? `mailto:${settings.email}` : '#' },
              ].map(({ id, icon: Icon, href }) => (
                <motion.a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10
                             flex items-center justify-center text-white/50
                             hover:bg-[#1A56FF] hover:text-white
                             hover:border-[#1A56FF] transition-all duration-200"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            <h4 className="font-heading font-bold text-sm uppercase
                           tracking-widest text-white/40">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {sections.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="font-body text-sm text-white/50 text-left
                             hover:text-[#1A56FF] transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            <h4 className="font-heading font-bold text-sm uppercase
                           tracking-widest text-white/40">
              Get In Touch
            </h4>
            <div className="flex flex-col gap-3">
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="font-body text-sm text-white/50 hover:text-[#1A56FF] transition-colors">{settings.email}</a>
              )}
              {settings?.phone && (
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="font-body text-sm text-white/50 hover:text-[#1A56FF] transition-colors">{settings.phone}</a>
              )}
              {settings?.location && (
                <p className="font-body text-sm text-white/50">{settings.location}</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10
                        flex flex-col md:flex-row items-center
                        justify-between gap-4">
          <p className="font-body text-white/30 text-sm">
            © {new Date().getFullYear()} Bensidney Githu Ndung'u.
            All rights reserved.
          </p>
          <p className="font-body text-white/30 text-sm flex items-center gap-1.5">
            Built with
            <Heart size={12} className="text-[#1A56FF] fill-[#1A56FF]" />
            using React + Node.js
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;