import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import AppRoutes from "./routes/Routes";
import MenuLateral from "./components/MenuLateral.jsx";
import "./App.css";

function App() {
  const location = useLocation();
  return (
    <div style={{ display: "flex" }}>
      {/* Renderiza MenuLateral solo si no estamos en la ruta de login */}
      {location.pathname !== "/login" && <MenuLateral />}
      <div style={{ flex: 1 }}>
        <AppRoutes /> {/* Aquí se llama a las rutas definidas */}
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
