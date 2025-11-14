import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import HomePage from "@/pages/HomePage";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return null; // opzionale: loader

  return (
    <Routes>
      {/* Homepage pubblica */}
      <Route path="/homepage" element={<HomePage />} />

      {/* Dashboard protetta */}
      <Route
        path="/dashboard/*"
        element={user ? <DashboardLayout /> : <Navigate to="/homepage" replace />}
      />

      {/* Redirect root hash a homepage */}
      <Route path="/" element={<Navigate to="/homepage" replace />} />
    </Routes>
  );
}
