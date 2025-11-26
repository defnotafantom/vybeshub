import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import WaveAnimation from '@/components/WaveAnimation';
import Logo from '@/components/Logo';
import { FaUserShield } from 'react-icons/fa';

const MaintenancePage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showLoginForm, setShowLoginForm] = useState(false);

  // Data di lancio: 5 giorni da ora
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 5);

  // Funzione calcolo countdown
  const calculateTimeLeft = () => {
    const now = new Date();
    const diff = launchDate - now;
    return {
      days: Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)), 0),
      hours: Math.max(Math.floor((diff / (1000 * 60 * 60)) % 24), 0),
      minutes: Math.max(Math.floor((diff / (1000 * 60)) % 60), 0),
      seconds: Math.max(Math.floor((diff / 1000) % 60), 0),
    };
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Login Supabase
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.log('Supabase login response:', data, error);

      if (error) {
        setError(error.message);
      } else if (data.user) {
        setShowSuccess(true);
        setTimeout(() => navigate('/dashboard'), 1200);
      } else {
        setError('Login failed. Check your credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('Unexpected error during login.');
    }
  };

  const renderTimeBlock = (value, label, colorClass) => (
    <div className="flex flex-col items-center">
      <motion.span
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`font-bold text-4xl md:text-5xl ${colorClass}`}
      >
        {value.toString().padStart(2, '0')}
      </motion.span>
      <span className="text-sm md:text-base text-white">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-gray-900 p-4">
      <WaveAnimation />

      {/* Countdown centrale */}
      <div className="z-10 flex flex-col items-center justify-center space-y-4">
        <Logo />
        <p className="text-white text-lg md:text-xl font-semibold">
          Approximately 5 days left
        </p>
        <div className="flex justify-center space-x-6 md:space-x-8 mt-2">
          {renderTimeBlock(timeLeft.days, "Days", "text-blue-400")}
          {renderTimeBlock(timeLeft.hours, "Hours", "text-blue-300")}
          {renderTimeBlock(timeLeft.minutes, "Minutes", "text-sky-200")}
          {renderTimeBlock(timeLeft.seconds, "Seconds", "text-sky-100")}
        </div>
      </div>

      {/* Pulsante STAFF ONLY e login */}
      <div className="absolute top-1/2 right-4 md:right-10 transform -translate-y-1/2 flex flex-col items-center space-y-2 z-20">
        <div className="flex items-center space-x-1 text-white font-bold">
          <FaUserShield />
          <span>STAFF ONLY</span>
        </div>

        {!showLoginForm && (
          <button
            onClick={() => setShowLoginForm(true)}
            className="py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        )}

        {/* Popup login successo */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-2 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold shadow-lg"
            >
              Login successful!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form login */}
        <AnimatePresence>
          {showLoginForm && (
            <motion.form
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              onSubmit={handleLogin}
              className="w-64 flex flex-col space-y-3 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/30 mt-2"
            >
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Accedi
              </button>
              <button
                type="button"
                onClick={() => setShowLoginForm(false)}
                className="mt-2 text-sm text-gray-600 underline"
              >
                Chiudi
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MaintenancePage;

