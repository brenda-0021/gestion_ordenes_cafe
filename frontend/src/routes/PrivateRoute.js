import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, requiredRole }) => {
  const { currentUser, role } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/principal" />; // O a donde desees redirigir a usuarios sin acceso
  }

  return children;
};

export default PrivateRoute;
