import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { AuthContext } from '@/context/AuthContext';
import UserGreeting from '@/components/UserGreeting';
import { supabase } from '@/lib/supabaseClient';

const LoginForm = ({ setAuthMode }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showGreeting, setShowGreeting] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleIdentifierChange = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, identifier: value });

    if (!supabase) {
      if (value.toLowerCase() === 'artist' || value.toLowerCase() === 'stager') {
        setUser({
          username: value.charAt(0).toUpperCase() + value.slice(1),
          role: value.toLowerCase(),
          avatarUrl: `https://avatar.vercel.sh/${value}.png?text=${value.charAt(0)}`
        });
        setShowGreeting(true);
      } else {
        setShowGreeting(false);
      }
      return;
    }

    if (value.includes('@')) {
      const { data } = await supabase
        .from('profiles')
        .select('username, role, avatar_url')
        .eq('email', value)
        .single();

      if (data) {
        setUser({ username: data.username, role: data.role, avatarUrl: data.avatar_url });
        setShowGreeting(true);
      } else {
        setShowGreeting(false);
      }
    } else {
      setShowGreeting(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!supabase) {
      if (user) {
        login(user);
        navigate('/dashboard'); // redirect qui
      } else {
        toast({
          title: "🚧 Database non connesso!",
          description: "Usa 'artist' o 'stager'.",
          variant: "destructive"
        });
      }
      setLoading(false);
      return;
    }
  
    const { error } = await signIn({
      email: formData.identifier,
      password: formData.password,
    });
  
    if (!error) navigate('/dashboard'); // redirect
    setLoading(false);
  };
  return (
    <AnimatePresence>
      <motion.div
        key="loginForm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-sky-100 relative max-w-md w-full"
      >
        {showGreeting && user && <UserGreeting user={user} />}

        <motion.h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">
          Entra su Vybes
        </motion.h2>
        <motion.p className="text-slate-600 text-center mb-8">
          Gestisci account, notifiche, annunci e molto altro.
        </motion.p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-slate-700">Username / E-mail</Label>
            <Input
              id="username"
              type="text"
              placeholder="Inserisci username o email"
              value={formData.identifier}
              onChange={handleIdentifierChange}
              className="bg-white"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Inserisci la tua password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-white"
              disabled={loading}
            />
            <Link to="/forgot-password" className="block text-sm text-sky-600 hover:text-sky-700 mt-1">
              Hai dimenticato la password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold py-3 relative"
            disabled={loading}
          >
            {loading ? 'Accesso in corso...' : 'ACCEDI'}
          </Button>

          <div className="border-t border-sky-200 my-4"></div>

          <div className="text-center">
            <p className="text-slate-600 mb-2">Non hai ancora un account?</p>
            <Button
              type="button"
              onClick={() => setAuthMode('register')}
              variant="outline"
              className="w-full border-2 border-sky-400 text-sky-600 hover:bg-sky-50 font-semibold py-3"
              disabled={loading}
            >
              REGISTRATI
            </Button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginForm;






