import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import AppRoutes from "./routes/Routes";
import MenuLateral from "./components/MenuLateral.jsx";
import NuevaOrden from "./pages/NuevaOrden.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <MenuLateral />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/nueva-orden" element={<NuevaOrden />} />
            {/* Agrega más rutas según sea necesario */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default App;
