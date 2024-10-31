"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  const { logout } = useAuth();
  const navigate = useNavigate();
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

  const handleLogout = async () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { name: "Tablero", icon: HomeIcon, path: "/principal" },
    {
      name: "Crear Nueva Orden",
      icon: ClipboardDocumentIcon,
      path: "/nueva-orden",
    },
    { name: "Panel Gerente", icon: Cog6ToothIcon, path: "/dashboard-gerente" },
    {
      name: "Cerrar Sesión",
      icon: ArrowRightOnRectangleIcon,
      action: handleLogout,
    },
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
                {item.path ? (
                  <Link
                    to={item.path}
                    className="flex items-center px-3 py-3 rounded-lg transition-all duration-200 hover:bg-cafe-medio/20"
                    onClick={() => isMobile && toggleMobileMenu()}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                ) : (
                  <button
                    onClick={item.action}
                    className="flex items-center px-3 py-3 w-full text-left rounded-lg transition-all duration-200 hover:bg-cafe-medio/20"
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </button>
                )}
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
