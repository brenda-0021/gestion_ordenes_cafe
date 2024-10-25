import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Principal from "../pages/Principal.jsx";
import NuevaOrden from "../pages/NuevaOrden.jsx";
import PrivateRoute from "./PrivateRoute.js";

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
          //<PrivateRoute>
          //<NuevaOrden />
          //</PrivateRoute>
          <NuevaOrden />
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
