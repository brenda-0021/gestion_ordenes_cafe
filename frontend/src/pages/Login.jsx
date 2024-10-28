"use client";

import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { app } from "../credenciales";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Principal from "../pages/Principal";

const auth = getAuth(app);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registrando, setRegistrando] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (registrando) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Almacena datos relevantes en localStorage al registrarte
        const userData = {
          email: userCredential.user.email,
          uid: userCredential.user.uid,
          role: "gerente",
        };
        localStorage.setItem("user", JSON.stringify(userData));
        alert("Registro exitoso");
      } catch (error) {
        alert("Asegúrate de que la contraseña tenga más de 8 caracteres");
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userData = {
          email: userCredential.user.email,
          uid: userCredential.user.uid,
          role:
            userCredential.user.email === "brenda@gmail.com"
              ? "gerente"
              : "mesero",
        };
        login(userCredential.user);
        localStorage.setItem("user", JSON.stringify(userData));
        //alert("Inicio de sesión exitoso");
        // Redirección basada en el rol
        if (userData.role === "gerente") {
          navigate("/dashboard-gerente");
        } else {
          navigate("/principal");
        }
      } catch (error) {
        alert("El correo o la contraseña son incorrectos");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cafe-suave">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-cafe-oscuro text-center">
          {registrando ? "Regístrate" : "Inicia Sesión"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-cafe-oscuro"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-cafe-claro border border-cafe-medio rounded-md text-cafe-oscuro placeholder-cafe-medio focus:outline-none focus:ring-cafe-intenso focus:border-cafe-intenso"
              placeholder="nombre@gmail.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-cafe-oscuro"
            >
              Contraseña
            </label>
            <div className="mt-1 relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full px-3 py-2 bg-cafe-claro border border-cafe-medio rounded-md text-cafe-oscuro placeholder-cafe-medio focus:outline-none focus:ring-cafe-intenso focus:border-cafe-intenso"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-cafe-medio hover:text-cafe-oscuro"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cafe-oscuro hover:bg-cafe-intenso focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cafe-medio"
            >
              {registrando ? "Registrarse" : "Iniciar Sesión"}
            </button>
          </div>
        </form>
        <p className="text-center mt-4 text-sm text-cafe-oscuro">
          {registrando ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button
            className="text-cafe-intenso font-bold"
            onClick={() => setRegistrando(!registrando)}
          >
            {registrando ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </div>
    </div>
  );
}
