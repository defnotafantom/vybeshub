import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabaseClient.js';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {   // <- named export
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabase) {
            setLoading(false);
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

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
            }
        );

        return () => authListener.subscription.unsubscribe();
    }, []);

    const mockLogin = (userData) => {
        localStorage.setItem('vybes_user', JSON.stringify(userData));
        setUser(userData);
    };

    const mockLogout = () => {
        localStorage.removeItem('vybes_user');
        setUser(null);
    };

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
        user,
        session,
        loading,
        login: supabase ? (data) => supabase.auth.signInWithPassword(data) : mockLogin,
        logout: supabase ? () => supabase.auth.signOut() : mockLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

