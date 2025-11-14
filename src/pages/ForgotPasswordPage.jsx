import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Errore",
        description: "Inserisci un indirizzo email valido",
        variant: "destructive"
      });
      return;
    }

    // Qui passiamo redirectTo per avere un link cliccabile nella mail
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    });

    if (error) {
      toast({
        title: "Errore invio email",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setIsSubmitted(true);
      toast({
        title: "Email inviata!",
        description: "Controlla la tua casella di posta per le istruzioni di recupero password.",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Recupero Password - Vybes</title>
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 via-white to-blue-100/50 -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sky-600 hover:text-sky-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Torna indietro</span>
          </button>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-sky-100">
            {!isSubmitted ? (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-full mb-4">
                    <Mail className="w-8 h-8 text-sky-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Recupero Password</h2>
                  <p className="text-slate-600">Inserisci la tua email per ricevere le istruzioni di recupero</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tua@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Invia Email di Recupero
                  </Button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                  <Mail className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">Email Inviata!</h2>
                <p className="text-slate-600 mb-6">Controlla la tua casella di posta per le istruzioni di recupero password.</p>
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="border-sky-300 text-sky-600 hover:bg-sky-50"
                >
                  Torna al Login
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;


