import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthForm = () => {
  const [mode, setMode] = useState('login'); // 'login' o 'register'

  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {mode === 'login' ? (
          <motion.div
            key="login"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <LoginForm setAuthMode={setMode} />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <RegisterForm setAuthMode={setMode} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthForm;


