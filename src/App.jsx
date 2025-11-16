import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './pages/DashboardLayout';
import HomePage from './pages/HomePage';

// Lazy load della mappa
const MapViewItalia = React.lazy(() => import('./components/MapViewItalia.jsx'));

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading auth...</div>;

  return (
    <Routes>
      <Route path="/homepage" element={<HomePage />} />

      <Route
        path="/dashboard/*"
        element={
          user ? (
            <DashboardLayout>
              {/* Suspense solo attorno alla mappa */}
              <Suspense fallback={<div>Loading map...</div>}>
                <MapViewItalia />
              </Suspense>
            </DashboardLayout>
          ) : (
            <Navigate to="/homepage" replace />
          )
        }
      />

      <Route path="/" element={<Navigate to="/homepage" replace />} />
    </Routes>
  );
}

