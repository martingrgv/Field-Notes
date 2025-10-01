import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  // Wait for auth context to initialize before making routing decisions
  if (!isInitialized) {
    return null; // or a loading spinner
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLoginSuccess = () => {
    // Navigation will be handled by the Navigate component above
    // after the auth state updates
  };

  return <LoginForm onSuccess={handleLoginSuccess} />;
};

export default LoginPage;