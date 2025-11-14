import React from 'react';
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center space-y-4"
    >
      <div className="relative">
        <img
          className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl"
          alt="Vybes logo - abstract artistic design"
          src="https://i.imgur.com/gGwB8VE.png"
        />
      </div>
      
      <div className="text-center space-y-2">
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600 tracking-tight">
          Vybes
        </h1>
        <p className="text-sm md:text-base font-semibold text-slate-600 tracking-widest uppercase">
          Bridging Culture & Opportunity
        </p>
      </div>
    </motion.div>
  );
};

export default Logo;