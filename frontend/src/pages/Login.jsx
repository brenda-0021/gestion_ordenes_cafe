"use client";

import React, { useState } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { app } from "../credenciales";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const auth = getAuth(app);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registrando, setRegistrando] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (registrando) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userData = {
          email: userCredential.user.email,
          uid: userCredential.user.uid,
          role: "gerente",
        };
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
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

        if (userData.role === "gerente") {
          navigate("/dashboard-gerente");
        } else {
          navigate("/principal");
        }
      }
    } catch (error) {
      setError(
        registrando
          ? "La contraseña debe tener al menos 8 caracteres"
          : "El correo o la contraseña son incorrectos"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cafe-oscuro via-cafe-medio to-cafe-suave p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-100 hover:scale-[1.02]">
        <h2 className="text-3xl font-bold mb-8 text-cafe-oscuro text-center">
          {registrando ? "Crear cuenta" : "Bienvenido de nuevo"}
        </h2>
        <p className="text-cafe-medio text-center mb-8">
          {registrando
            ? "Complete los campos para registrarse"
            : "Ingrese sus credenciales para continuar"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-cafe-oscuro"
            >
              Correo Electrónico
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cafe-medio" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 bg-cafe-claro/20 border border-cafe-medio/20 rounded-xl text-cafe-oscuro placeholder-cafe-medio/50 focus:outline-none focus:ring-2 focus:ring-cafe-intenso focus:border-transparent transition-all duration-200"
                placeholder="nombre@gmail.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-cafe-oscuro"
            >
              Contraseña
            </label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cafe-medio" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-12 py-3 bg-cafe-claro/20 border border-cafe-medio/20 rounded-xl text-cafe-oscuro placeholder-cafe-medio/50 focus:outline-none focus:ring-2 focus:ring-cafe-intenso focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cafe-medio hover:text-cafe-oscuro transition-colors duration-200"
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

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-cafe-oscuro hover:bg-cafe-intenso focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cafe-medio transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Procesando...
              </span>
            ) : registrando ? (
              "Crear cuenta"
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-cafe-oscuro">
            {registrando ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
            <button
              className="font-semibold text-cafe-intenso hover:text-cafe-oscuro transition-colors duration-200"
              onClick={() => {
                setRegistrando(!registrando);
                setError("");
              }}
            >
              {registrando ? "Inicia sesión" : "Regístrate"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
