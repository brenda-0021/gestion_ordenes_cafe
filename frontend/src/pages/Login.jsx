"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempted with:", { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cafe-suave">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-cafe-oscuro text-center">
          Inicia Sesión
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
              Iniciar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
