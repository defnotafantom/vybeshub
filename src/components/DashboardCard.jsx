import React from 'react';
import { motion } from 'framer-motion';

const DashboardCard = ({ title, date }) => {
  return (
    <motion.div
      className="p-6 rounded-xl shadow-lg bg-white flex flex-col items-center justify-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-500">{date}</p>
    </motion.div>
  );
};

export default DashboardCard;
