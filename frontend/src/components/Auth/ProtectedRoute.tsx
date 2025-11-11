import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';

const ProtectedRoute: React.FC = () => {
  const { user } = useAuthContext();
  const isAuthenticated = !!user; // Check if user exists

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
