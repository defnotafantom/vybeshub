// src/components/ui/Tooltip.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Tooltip = ({ content, children, side = 'top' }) => {
  const [visible, setVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 w-64 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-100 text-slate-800 text-sm ${positions[side]}`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
