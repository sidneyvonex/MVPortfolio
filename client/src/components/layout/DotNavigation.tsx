import { motion } from 'framer-motion';
import { useActiveSection, sections } from '../../hooks/useActiveSection';

const DotNavigation = () => {
  const { activeSection, scrollToSection } = useActiveSection();

  return (
    <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-3">
      {sections.map(({ id, label }) => {
        const isActive = activeSection === id;
        return (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className="group relative flex items-center justify-end"
            aria-label={label}
          >
            {/* Label tooltip */}
            <span className="
              absolute right-6 opacity-0 group-hover:opacity-100
              transition-all duration-200 text-xs font-body
              bg-primary text-white px-2 py-1 rounded-md
              whitespace-nowrap pointer-events-none
              -translate-x-1 group-hover:translate-x-0
            ">
              {label}
            </span>

            {/* Dot */}
            <motion.div
              animate={{
                scale: isActive ? 1.3 : 1,
                backgroundColor: isActive ? '#1A56FF' : '#CBD5E1',
              }}
              transition={{ duration: 0.3 }}
              className="w-3 h-3 rounded-full cursor-pointer"
            />
          </button>
        );
      })}
    </div>
  );
};

export default DotNavigation;