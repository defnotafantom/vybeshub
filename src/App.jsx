import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './pages/DashboardLayout';
import HomePage from './pages/HomePage';
import TestSupabase from "@/pages/TestSupabase";

// Lazy load map
const MapViewItalia = React.lazy(() => import('./components/MapViewItalia.jsx'));

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading auth...</div>;

  return (
    <Routes>
      {/* Public */}
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/test-supabase" element={<TestSupabase />} />

      {/* Protected */}
      <Route
        path="/dashboard"
        element={user ? <DashboardLayout /> : <Navigate to="/homepage" replace />}
      >
        {/* Sub-routes INDEX */}
        <Route
          index
          element={
            <Suspense fallback={<div>Loading map...</div>}>
              <MapViewItalia />
            </Suspense>
          }
        />

        {/* Example: altra pagina */}
        {/*
        <Route path="profile" element={<UserProfile />} />
        <Route path="settings" element={<Settings />} />
        */}
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/homepage" replace />} />
    </Routes>
  );
}

