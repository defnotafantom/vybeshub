import React from 'react';
import { motion } from 'framer-motion';

const UserGreeting = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[calc(100%+20px)] w-full max-w-sm"
    >
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-sky-100 text-center space-y-3">
        <h3 className="text-xl font-bold text-slate-800">Che bello rivederti!</h3>
        <div className="flex items-center justify-center gap-4">
          <motion.div
            animate={{ rotate: [0, 20, -15, 10, 0] }}
            transition={{ duration: 1, ease: 'easeInOut', delay: 0.5 }}
          >
            <img 
              className="w-16 h-16 rounded-full border-4 border-sky-200" 
              alt={`Avatar for ${user.username}`}
             src="https://images.unsplash.com/photo-1653756223371-7dd0687680c6" />
          </motion.div>
          <div>
            <p className="font-bold text-lg text-slate-700">{user.username}</p>
            <p className="text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-full px-3 py-1 inline-block">
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserGreeting;