import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Logo';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import WaveAnimation from '@/components/WaveAnimation';

const HomePage = () => {
  const [authMode, setAuthMode] = useState(null); // null | 'login' | 'register'

  return (
    <>
      <Helmet>
        <title>Vybes - Bridging Culture & Opportunity</title>
        <meta name="description" content="Connetti artisti e stager. Gestisci il tuo profilo, annunci e notifiche su Vybes." />
      </Helmet>

      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 via-white to-blue-100/50 -z-10" />
        
        <div className="z-10 flex flex-col items-center justify-center flex-grow w-full">
          <AnimatePresence mode="wait">
            {/* Landing Page */}
            {!authMode && (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-8 max-w-2xl"
              >
                <Logo />

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight"
                >
                  ARE YOU READY TO MAKE SOME NOISE?
                </motion.h1>

                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 15 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAuthMode('login')}
                  className="px-12 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  ACCEDI
                </motion.button>
              </motion.div>
            )}

            {/* Login Form */}
            {authMode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
              >
                <LoginForm setAuthMode={setAuthMode} />
              </motion.div>
            )}

            {/* Register Form */}
            {authMode === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
              >
                <RegisterForm setAuthMode={setAuthMode} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <WaveAnimation />
      </div>
    </>
  );
};

export default HomePage;












