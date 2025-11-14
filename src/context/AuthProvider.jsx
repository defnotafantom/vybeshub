import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabaseClient.js';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      console.warn("Supabase client not initialized. Fallback to localStorage.");
      const storedUser = localStorage.getItem('vybes_user');
      if (storedUser) setUser(JSON.parse(storedUser));
      return;
    }

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // fallback per mock environment
  const mockLogin = (userData) => {
    localStorage.setItem('vybes_user', JSON.stringify(userData));
    setUser(userData);
  };
  const mockLogout = () => {
    localStorage.removeItem('vybes_user');
    setUser(null);
  };

  // nuova login che può accettare user già loggato (utile per reset password)
  const login = async (userData) => {
    if (userData?.email && userData?.password) {
      // login normale via Supabase
      const { data, error } = await supabase.auth.signInWithPassword(userData);
      if (error) throw error;
      setUser(data.user);
      setSession(data.session);
    } else if (userData?.id) {
      // caso reset password / login automatico
      setUser(userData);
    } else {
      mockLogin(userData);
    }
  };

  const logout = supabase ? () => supabase.auth.signOut() : mockLogout;

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: logout,
    user,
    session,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


