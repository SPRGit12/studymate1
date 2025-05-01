import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../services/firebaseConfig';

const PrivateRoute = () => {
  // Check if user is authenticated
  const isAuthenticated = !!auth.currentUser;

  // If not authenticated, redirect to login
  // Otherwise, render the child routes
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;