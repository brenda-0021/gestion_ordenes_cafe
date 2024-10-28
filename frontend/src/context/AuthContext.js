import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null); // Nuevo estado para el rol

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
    setRole(user?.email === "brenda@gmail.com" ? "gerente" : "mesero"); // Determina el rol
  }, []);

  const login = (user) => {
    setCurrentUser(user);
    setRole(user.email === "brenda@gmail.com" ? "gerente" : "mesero"); // Determina el rol al iniciar sesión
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    setRole(null); // Limpia el rol al cerrar sesión
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ currentUser, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
