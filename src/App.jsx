import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      {/* Opzionale: route fallback */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default App;










