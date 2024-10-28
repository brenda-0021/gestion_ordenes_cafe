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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Agregar Producto</h2>
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
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
          >
            Agregar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 border border-gray-300 rounded px-4 py-2 hover:bg-gray-200"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default NuevoProductoModal;
