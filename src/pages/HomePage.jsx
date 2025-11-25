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
        <title>Vybes</title>
        <meta
          name="description"
          content="Connetti artisti e stager. Gestisci il tuo profilo, annunci e notifiche su Vybes."
        />
      </Helmet>

      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-x-hidden overflow-y-visible">

        {/* Background molto chiaro e animato */}
        <motion.div
          className="absolute inset-0 -z-10"
          style={{
            background: "linear-gradient(135deg, rgba(248, 252, 255, 0.2) 0%, rgb(223, 238, 252) 50%, rgb(202, 209, 211) 100%)",
            backgroundSize: "400% 400%",
          }}
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 60, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
        />

        {/* Wave con bolle dietro contenuti */}
        <WaveAnimation />

        <div className="z-10 flex flex-col items-center justify-center flex-grow w-full overflow-visible">

          <AnimatePresence mode="wait">
            {/* Landing Page */}
            {!authMode && (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-8 max-w-2xl"
              >
                <Logo />

                {/* H1 con fade-in sequenziale parole */}
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight"
                >
                  ARE <span className="text-blue-600">YOU</span> READY TO MAKE SOME <span className="text-sky-500">NOISE?</span>
                </motion.h1>

                {/* Pulsante ACCEDI con gradiente animato */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.01, type: "spring", stiffness: 200, damping: 15 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAuthMode('login')}
                  className="px-12 py-4 rounded-full font-semibold shadow-lg text-white bg-gradient-to-r from-sky-500 to-blue-600 animate-gradient-x"
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
                transition={{ duration: 0.35 }}
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
      </div>
    </>
  );
};

export default HomePage;




