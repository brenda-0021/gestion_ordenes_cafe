import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Principal from "../pages/Principal.jsx";
import NuevaOrden from "../pages/NuevaOrden.jsx";
import PrivateRoute from "./PrivateRoute.js";
import DashboardGerente from "../pages/DashboardGerente.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/principal"
        element={
          <PrivateRoute>
            <Principal />
          </PrivateRoute>
        }
      />
      <Route
        path="/nueva-orden"
        element={
          <PrivateRoute>
            <NuevaOrden />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard-gerente"
        element={
          <PrivateRoute requiredRole="gerente">
            <DashboardGerente />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
