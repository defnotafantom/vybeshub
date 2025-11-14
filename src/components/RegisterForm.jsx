import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music, Briefcase } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

const RegisterPage = ({ setAuthMode }) => {
  const { toast } = useToast();
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const toggleRole = (role) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  const handleSelectChange = (value, fieldName) => setFormData({ ...formData, [fieldName]: value });
  const isValidUsername = (username) => /^[a-zA-Z0-9._]{3,30}$/.test(username);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { nome, cognome, birthDate, email, email2, password, password2, username, artistName, companyType } = formData;
    const errors = [];

    if (!nome) errors.push("Nome obbligatorio.");
    if (!cognome) errors.push("Cognome obbligatorio.");
    if (!birthDate) errors.push("Data di nascita obbligatoria.");
    if (!email || !email2) errors.push("Email obbligatoria e conferma necessaria.");
    if (email && email2 && email !== email2) errors.push("Le email non coincidono.");
    if (!username) errors.push("Username obbligatorio.");
    if (username && !isValidUsername(username)) errors.push("Username non valido.");
    if (!password || !password2) errors.push("Password obbligatoria e conferma necessaria.");
    if (password !== password2) errors.push("Le password non coincidono.");
    if (password && password.length < 6) errors.push("Password troppo corta.");
    if (roles.length === 0) errors.push("Seleziona almeno un ruolo.");

    if (errors.length > 0) {
      toast({ title: "Errore!", description: errors.join(" "), variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      const birthDateISO = new Date(birthDate).toISOString().split('T')[0];
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            Name: nome,
            LastName: cognome,
            username,
            roles,
            birth_date: birthDateISO,
            stagename: roles.includes('artist') ? artistName || null : null,
            company_type: roles.includes('stager') ? companyType || null : null,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Registrazione completata!",
        description: "Controlla la tua email per verificare il tuo account.",
      });

      setFormData({});
      setRoles([]);
      setAuthMode('login');

    } catch (err) {
      toast({
        title: "Errore di registrazione",
        description: err.message || "Si è verificato un errore.",
        variant: "destructive"
      });
    } finally { setLoading(false); }
  };

  const renderFormFields = () => {
    const commonFields = (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" placeholder="Nome" onChange={handleInputChange} disabled={loading} value={formData.nome || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cognome">Cognome</Label>
            <Input id="cognome" placeholder="Cognome" onChange={handleInputChange} disabled={loading} value={formData.cognome || ''} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Data di nascita</Label>
          <Input id="birthDate" type="date" onChange={handleInputChange} disabled={loading} value={formData.birthDate || ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="tua@email.com" onChange={handleInputChange} disabled={loading} value={formData.email || ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email2">Conferma Email</Label>
          <Input id="email2" type="email" placeholder="Conferma email" onChange={handleInputChange} disabled={loading} value={formData.email2 || ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="Username unico" onChange={handleInputChange} disabled={loading} value={formData.username || ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Password sicura" onChange={handleInputChange} disabled={loading} value={formData.password || ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password2">Conferma Password</Label>
          <Input id="password2" type="password" placeholder="Conferma password" onChange={handleInputChange} disabled={loading} value={formData.password2 || ''} />
        </div>
      </>
    );

    return (
      <>
        {commonFields}
        {roles.includes('artist') && (
          <div className="space-y-2">
            <Label htmlFor="artistName">Nome d’arte</Label>
            <Input id="artistName" placeholder="Il tuo nome d'arte" onChange={handleInputChange} disabled={loading} value={formData.artistName || ''} />
          </div>
        )}
        {roles.includes('stager') && (
          <div className="space-y-2">
            <Label>Tipo di stager</Label>
            <Select onValueChange={(value) => handleSelectChange(value, 'companyType')} disabled={loading} value={formData.companyType || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona tipo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="privato">Privato</SelectItem>
                <SelectItem value="azienda">Azienda</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 p-6">

      {/* Box info */}
      <motion.div
        className="flex-none w-full md:w-[600px] max-h-[85vh] bg-white rounded-2xl shadow-xl p-8 border border-sky-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-700 mb-2">🎤 Artista</h3>
          <p className="text-slate-600 text-base leading-relaxed">
            Crea e gestisci il tuo profilo, pubblica contenuti e partecipa ad eventi.
            I contenuti più pertinenti vengono mostrati al pubblico grazie a un algoritmo dedicato.
            Collabora con altri artisti o stager tramite la piattaforma.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">🎭 Stager</h3>
          <p className="text-slate-600 text-base leading-relaxed">
            Pubblica eventi, cerca artisti, gestisce candidature e organizza collaborazioni
            attraverso la propria dashboard. Visualizza il feed completo e crea annunci sulla mappa
            per evidenziare ciò che cerca.
          </p>
        </div>
      </motion.div>

      {/* Register form */}
      <motion.div
        className="flex-none w-full md:w-[500px] max-h-[85vh] bg-white rounded-2xl shadow-xl p-8 border border-sky-100 overflow-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="text-center space-y-4 pb-4">
          <h3 className="font-semibold text-lg text-slate-700">Quali ruoli vuoi assumere?</h3>
          <p className="text-slate-500">Puoi selezionare uno o entrambi i ruoli.</p>

          <div className="flex justify-center gap-6 pt-2">
            <button
              type="button"
              onClick={() => toggleRole('artist')}
              className={`flex flex-col items-center justify-center w-32 py-6 rounded-2xl border-2 transition-all shadow-md ${
                roles.includes('artist')
                  ? 'bg-sky-500 border-sky-600 text-white'
                  : 'border-sky-300 text-sky-700 hover:bg-sky-50'
              }`}
            >
              <Music className="w-6 h-6 mb-2" />
              Artista
            </button>

            <button
              type="button"
              onClick={() => toggleRole('stager')}
              className={`flex flex-col items-center justify-center w-32 py-6 rounded-2xl border-2 transition-all shadow-md ${
                roles.includes('stager')
                  ? 'bg-blue-600 border-blue-700 text-white'
                  : 'border-blue-300 text-blue-700 hover:bg-blue-50'
              }`}
            >
              <Briefcase className="w-6 h-6 mb-2" />
              Stager
            </button>
          </div>
        </div>

        <AnimatePresence>
          {roles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6"
            >
              <p className="text-slate-700 font-medium mb-2">Hai selezionato:</p>
              <ul className="flex gap-3 flex-wrap">
                {roles.map((r) => (
                  <li
                    key={r}
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      r === 'artist' ? 'bg-sky-500 text-white' : 'bg-blue-600 text-white'
                    }`}
                  >
                    {r === 'artist' ? '🎤 Artista' : '🎭 Stager'}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {roles.length > 0 && (
          <form onSubmit={handleRegister} className="space-y-4">
            {renderFormFields()}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold py-3"
              disabled={loading}
            >
              {loading ? 'Registrazione in corso...' : 'REGISTRATI'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="mt-2 w-full text-sky-600 hover:text-sky-700"
              onClick={() => setAuthMode('login')}
            >
              Torna al login
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default RegisterPage;










