import React from 'react';
import { Navigate } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import { useAuth } from '../../context/AuthContext';

const RegisterPage: React.FC = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  // Wait for auth context to initialize before making routing decisions
  if (!isInitialized) {
    return null; // or a loading spinner
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleRegisterSuccess = () => {
    // Can add additional logic here if needed
    // For now, the success message in RegisterForm is sufficient
  };

  return <RegisterForm onSuccess={handleRegisterSuccess} />;
};

export default RegisterPage;