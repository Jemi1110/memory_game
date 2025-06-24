import type { ReactNode } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CardContainerProps {
  children: ReactNode;
  title?: string;
  className?: string;
  emptyMessage?: string;
  isEmpty?: boolean;
  loading?: boolean;
}

const CardContainer: React.FC<CardContainerProps> = ({
  children,
  title,
  className = '',
  emptyMessage = 'No hay cartas disponibles',
  isEmpty = false,
  loading = false,
}) => {
  return (
    <div className={`bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-100 ${className}`}>
      {title && (
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center">
          {title}
        </h3>
      )}
      
      <div className="relative min-h-[300px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <p className="text-gray-600 font-medium">Cargando cartas...</p>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="relative w-24 h-24 mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full animate-pulse"></div>
              <svg 
                className="relative w-full h-full p-4 text-blue-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <p className="text-center">{emptyMessage}</p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default CardContainer;
