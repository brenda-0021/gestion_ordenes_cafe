"use client";

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const MenuLateral = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const menuItems = [
    { name: "Order Board", icon: "fas fa-clipboard", href: "/order-board" },
    {
      name: "Create New Order",
      icon: "fas fa-plus-square",
      href: "/new-order",
    }, // PlusSquare icon
    { name: "Settings", icon: "fas fa-cog", href: "/settings" },
    { name: "Log Out", icon: "fas fa-sign-out-alt", href: "/logout" },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-cafe-oscuro text-white transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <button
        className="absolute -right-3 top-9 bg-cafe-oscuro text-white p-1 rounded-full"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? "→" : "←"}
      </button>
      <div className="p-4">
        <h1
          className={`text-2xl font-bold mb-6 ${
            isCollapsed ? "hidden" : "block"
          }`}
        >
          Café Menu
        </h1>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} passHref>
                  <div
                    className={`flex items-center p-2 rounded-md transition-colors duration-200 ${
                      pathname === item.href
                        ? "bg-cafe-medio"
                        : "hover:bg-cafe-medio"
                    }`}
                  >
                    <i
                      className={`${item.icon} h-6 w-6`}
                      aria-hidden="true"
                    ></i>
                    <span
                      className={`ml-3 ${isCollapsed ? "hidden" : "block"}`}
                    >
                      {item.name}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};
export default MenuLateral;
