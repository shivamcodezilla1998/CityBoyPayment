import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, description, children, footer, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-canvas/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
              className={cn(
                'w-full max-w-lg bg-white rounded-2xl shadow-soft border border-soft pointer-events-auto overflow-hidden',
                className
              )}
            >
              {(title || description) && (
                <div className="flex flex-col space-y-1.5 p-6 border-b border-soft">
                  <div className="flex items-center justify-between">
                    {title && <h3 className="font-semibold leading-none tracking-tight text-primary">{title}</h3>}
                    <button
                      onClick={onClose}
                      className="rounded-full p-1.5 hover:bg-subtle transition-colors"
                    >
                      <X className="h-4 w-4 text-secondary" />
                    </button>
                  </div>
                  {description && <p className="text-sm text-secondary">{description}</p>}
                </div>
              )}
              <div className="p-6">{children}</div>
              {footer && (
                <div className="flex items-center justify-end p-6 border-t border-soft bg-subtle space-x-2">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
