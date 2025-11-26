import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './pages/DashboardLayout';
import HomePage from './pages/HomePage';
import TestSupabase from "@/pages/TestSupabase";
import MaintenancePage from "@/pages/MaintenancePage";
import { Toaster } from "react-hot-toast";

const MapDashboard = React.lazy(() => import('@/components/Map/MapDashboard'));
const Opportunities = React.lazy(() => import('@/components/Map/Opportunities'));

const MAINTENANCE_MODE = true;

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading auth...</div>;

  if (MAINTENANCE_MODE && !user) {
    return (
      <>
        <Toaster position="top-right" />
        <Routes>
          <Route path="*" element={<MaintenancePage />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/test-supabase" element={<TestSupabase />} />

        <Route path="/dashboard" element={user ? <DashboardLayout /> : <Navigate to="/homepage" replace />}>
          <Route
            index
            element={
              <Suspense fallback={<div className="p-4 text-center">Loading map...</div>}>
                <MapDashboard user={user} />
              </Suspense>
            }
          />
        </Route>

        <Route
          path="/opportunities"
          element={
            <Suspense fallback={<div className="p-4 text-center">Loading opportunità...</div>}>
              <Opportunities user={user} />
            </Suspense>
          }
        />

        <Route path="/" element={<Navigate to="/homepage" replace />} />
      </Routes>
    </>
  );
}

