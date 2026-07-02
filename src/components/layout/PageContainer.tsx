import React from 'react';
import { Breadcrumb } from './Breadcrumb';
import { motion } from 'framer-motion';

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
}

export function PageContainer({ children, title, description, breadcrumbs, actions }: PageContainerProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto w-full">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {breadcrumbs && <Breadcrumb items={breadcrumbs} className="mb-2" />}
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-primary tracking-tight"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-secondary mt-1"
            >
              {description}
            </motion.p>
          )}
        </div>
        {actions && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="shrink-0 w-full sm:w-auto"
          >
            {actions}
          </motion.div>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
