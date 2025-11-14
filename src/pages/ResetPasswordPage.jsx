import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth(); // hook dal AuthProvider
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const accessToken = searchParams.get('access_token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast({ title: "Errore", description: "Inserisci entrambe le password", variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Errore", description: "Le password non coincidono", variant: "destructive" });
      return;
    }

    if (!accessToken) {
      toast({ title: "Errore", description: "Token di reset mancante o scaduto", variant: "destructive" });
      return;
    }

    setLoading(true);

    // Aggiorna la password su Supabase
    const { data, error } = await supabase.auth.updateUser({ password }, accessToken);

    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Aggiorna il context AuthProvider con il nuovo user
    if (data?.user) {
      login(data.user); // login automatico
    }

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-sky-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Password aggiornata!</h2>
          <p className="text-slate-600 mb-6">Sei ora loggato e puoi accedere al tuo account.</p>
          <Button onClick={() => navigate('/dashboard')} variant="outline" className="border-sky-300 text-sky-600 hover:bg-sky-50">
            Vai al Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Reset Password - Vybes</title></Helmet>
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-sky-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Imposta nuova password</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Nuova Password</Label>
              <Input id="password" type="password" placeholder="Nuova password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-700">Conferma Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Conferma password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold py-3" disabled={loading}>
              {loading ? 'Aggiornamento...' : 'Aggiorna Password'}
            </Button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
