import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import WaveAnimation from '@/components/WaveAnimation';
import Logo from '@/components/Logo';
import { FaUserShield } from 'react-icons/fa';
import clsx from 'clsx';

// Hook per larghezza finestra
const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
};

// --- FlipDigit ---
const FlipDigit = ({ value, colorClass }) => {
  const [prev, setPrev] = useState(value);
  useEffect(() => { if (prev !== value) setPrev(value); }, [value]);

  return (
    <div className="relative w-12 h-16 md:w-16 md:h-20 perspective">
      <motion.div
        key={value}
        initial={{ rotateX: -90 }}
        animate={{ rotateX: 0 }}
        exit={{ rotateX: 90 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className={clsx(
          'absolute w-full h-full flex items-center justify-center font-bold text-white rounded-lg shadow-lg bg-gradient-to-br from-gray-800 to-gray-900',
          colorClass
        )}
        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 0 6px rgba(255,255,255,0.1)' }}
      >
        {value.toString().padStart(2, '0')}
      </motion.div>
      <div className="absolute w-full h-1/2 top-0 left-0 rounded-t-lg bg-gradient-to-b from-white/10 to-transparent shadow-inner"></div>
      <div className="absolute w-full h-1/2 bottom-0 left-0 rounded-b-lg bg-gradient-to-t from-white/10 to-transparent shadow-inner"></div>
    </div>
  );
};

// --- Countdown ---
const Countdown = ({ timeLeft }) => (
  <div className="flex flex-wrap justify-center gap-4 mt-3">
    {[
      ['Days', timeLeft.days, 'text-blue-400'],
      ['Hours', timeLeft.hours, 'text-blue-300'],
      ['Minutes', timeLeft.minutes, 'text-sky-200'],
      ['Seconds', timeLeft.seconds, 'text-sky-100'],
    ].map(([label, value, color]) => (
      <div key={label} className="flex flex-col items-center">
        <FlipDigit value={value} colorClass={color} />
        <span className="text-sm md:text-base text-white">{label}</span>
      </div>
    ))}
  </div>
);

// --- StaffLogin ---
const StaffLogin = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else if (data.user) {
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 1200);
      } else setError('Login failed. Check your credentials.');
    } catch (err) {
      setError('Unexpected error during login.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center mt-4 md:mt-6 z-50 relative">
      <div className="flex items-center space-x-1 text-white font-bold">
        <FaUserShield />
        <span>STAFF ONLY</span>
      </div>

      {!showForm && (
        <motion.button
          onClick={() => setShowForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition mt-2 z-50 relative"
        >
          Login
        </motion.button>
      )}

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-2 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold shadow-lg z-50 relative"
          >
            Login successful!
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <motion.form
            key="login"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 120 }}
            onSubmit={handleLogin}
            className="w-64 flex flex-col space-y-3 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/30 mt-2 z-50 relative"
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
              disabled={loading}
              className="py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Accedi'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="mt-2 text-sm text-gray-600 underline"
            >
              Chiudi
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- MaintenancePage ---
const MaintenancePage = () => {
  const width = useWindowWidth();
  const isMobile = width < 768;

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 5);

  // Log visita avanzata in Supabase
  useEffect(() => {
    const logVisit = async () => {
      try {
        await supabase.from('visits').insert([{
          page: window.location.pathname,
          user_agent: navigator.userAgent,
          device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
          screen_width: window.innerWidth,
          screen_height: window.innerHeight,
          referrer: document.referrer || null,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          visited_at: new Date(),
          session_id: crypto.randomUUID(),
        }]);
      } catch (err) {
        console.error('Errore logging visita:', err);
      }
    };

    logVisit();

    const timer = setInterval(() => {
      const diff = launchDate - new Date();
      setTimeLeft({
        days: Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)), 0),
        hours: Math.max(Math.floor((diff / (1000 * 60 * 60)) % 24), 0),
        minutes: Math.max(Math.floor((diff / (1000 * 60)) % 60), 0),
        seconds: Math.max(Math.floor((diff / 1000) % 60), 0),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isMobile, launchDate]);

  return (
    <div className="min-h-screen w-full relative bg-gray-900 overflow-hidden">
      {/* Wave e bolle */}
      <WaveAnimation className="absolute top-0 left-0 w-full h-full z-0" />

      {/* Contenitore principale in primo piano */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100, damping: 20 }}
        className="relative z-50 flex flex-col items-center justify-start px-4"
        style={{ marginTop: isMobile ? '10vh' : '5vh' }}
      >
        <div className="flex flex-col items-center space-y-4 text-center w-full max-w-md">
          <Logo />
          <p className="text-white text-lg md:text-xl font-semibold mt-2">Approximately 5 days left</p>
          <Countdown timeLeft={timeLeft} />
          <p className="mt-4 px-4 py-2 bg-yellow-500/80 text-black rounded-lg font-semibold text-sm md:text-base text-center shadow-lg z-50 relative">
            🚧 La versione mobile del sito è in fase di sviluppo
          </p>
          <StaffLogin />
        </div>
      </motion.div>
    </div>
  );
};

export default MaintenancePage;





