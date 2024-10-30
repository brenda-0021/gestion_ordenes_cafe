"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  ClipboardDocumentIcon,
  Cog6ToothIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
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
    { name: "Ajustes", icon: Cog6ToothIcon, path: "/settings" },
    { name: "Cerrar Sesión", icon: ArrowRightOnRectangleIcon, path: "/logout" },
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
      <button
        className="sm:hidden fixed top-4 left-4 z-50 p-2.5 bg-cafe-medio hover:bg-cafe-oscuro text-cafe-suave rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cafe-claro focus:ring-offset-2"
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-cafe-oscuro to-cafe-medio text-cafe-suave shadow-xl transition-all duration-300 ease-in-out
          ${isCollapsed && !isMobile ? "w-20" : "w-64"}
          ${
            isMobile
              ? isMobileMenuOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          }
          z-40`}
      >
        <div className="flex items-center justify-between p-6 border-b border-cafe-medio/20">
          <h1
            className={`text-2xl font-bold tracking-tight ${
              isCollapsed && !isMobile ? "hidden" : "block"
            }`}
          >
            Menu
          </h1>
          {!isMobile && (
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-cafe-medio/20 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cafe-claro/20"
              aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
            >
              {isCollapsed ? (
                <ArrowRightIcon className="h-5 w-5" />
              ) : (
                <ArrowLeftIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200
                    hover:bg-cafe-medio/20 group relative
                    ${item.name === "Cerrar Sesión" ? "mt-8" : ""}
                  `}
                  onClick={() => isMobile && toggleMobileMenu()}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  <span
                    className={`ml-3 whitespace-nowrap overflow-hidden transition-opacity duration-200
                      ${
                        isCollapsed && !isMobile
                          ? "opacity-0 w-0"
                          : "opacity-100"
                      }
                    `}
                  >
                    {item.name}
                  </span>
                  {isCollapsed && !isMobile && (
                    <div className="absolute left-14 px-2 py-1 bg-cafe-oscuro rounded-md invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-30"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default MenuLateral;
