import type { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

const PageLayout: FC<PageLayoutProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 ${className}`}
    >
      <div className="max-w-7xl mx-20">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default PageLayout;
