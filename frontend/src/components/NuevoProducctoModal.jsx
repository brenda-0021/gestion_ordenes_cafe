"use client";

import React, { useState } from "react";

const NuevoProductoModal = ({ isOpen, onClose, onAddProduct }) => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProduct({ nombre, precio });
    setNombre("");
    setPrecio("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-cafe-oscuro text-center">
          Agregar Producto
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Precio:</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          <div className="flex justify-center space-x-2">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-cafe-medio text-white rounded-md hover:bg-cafe-oscuro focus:outline-none focus:ring-2 focus:ring-cafe-intenso"
            >
              Agregar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-cafe-claro hover:text-cafe-oscuro"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoProductoModal;
