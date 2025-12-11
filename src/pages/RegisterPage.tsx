import React from 'react';
import { Navigate } from 'react-router-dom';

// Registration is now handled through Google OAuth only
const RegisterPage: React.FC = () => {
  return <Navigate to="/login" replace />;
};

export default RegisterPage;