"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  ClipboardDocumentIcon,
  CogIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const MenuLateral = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const menuItems = [
    { name: "Tablero", icon: HomeIcon, path: "/" },
    {
      name: "Crear Nueva Orden",
      icon: ClipboardDocumentIcon,
      path: "/nueva-orden",
    },
    { name: "Ajustes", icon: CogIcon, path: "/settings" },
    { name: "Cerrar Sesión", icon: CogIcon, path: "/logout" },
  ];

  const toggleMenu = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Botón de hamburguesa solo para dispositivos móviles */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-cafe-medio text-cafe-suave rounded-md"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Menú lateral */}
      <div
        className={`fixed top-0 left-0 h-full bg-cafe-oscuro text-cafe-suave transition-all duration-300 ease-in-out
          ${isCollapsed && !isMobile ? "w-16" : "w-64"}
          ${
            isMobile
              ? isMobileMenuOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          }
          z-40`}
      >
        <div className="flex items-center justify-between p-4">
          <h1
            className={`text-2xl ml-auto pr-4 ${
              isCollapsed && !isMobile ? "hidden" : "block"
            }`}
          >
            Menu
          </h1>
          {!isMobile && (
            <button
              onClick={toggleMenu}
              className="text-cafe-suave hover:text-cafe-claro"
            >
              {isCollapsed ? (
                <ArrowRightIcon className="h-6 w-6" />
              ) : (
                <ArrowLeftIcon className="h-6 w-6" />
              )}
            </button>
          )}
        </div>

        <ul className="mt-8 space-y-4">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className="px-4 py-2 hover:bg-cafe-medio rounded-lg transition-colors duration-200"
            >
              <Link
                to={item.path}
                className="flex items-center space-x-2"
                onClick={() => isMobile && toggleMobileMenu()}
              >
                <item.icon className="h-6 w-6" />
                <span
                  className={`${isCollapsed && !isMobile ? "hidden" : "block"}`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Fondo para cerrar el menú móvil al hacer clic fuera */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </>
  );
};

export default MenuLateral;
