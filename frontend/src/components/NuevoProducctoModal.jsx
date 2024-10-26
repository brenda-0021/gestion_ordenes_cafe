"use client";

import React, { useState } from "react";

export default function NewProductModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    setFormData({ nombre: "", precio: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-cafe-oscuro text-center">
          Agregar Nuevo Producto
        </h2>

        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre del Producto"
          className="mb-2 p-2 w-full border rounded-md"
        />
        <input
          type="number"
          name="precio"
          value={formData.precio}
          onChange={handleChange}
          placeholder="Precio"
          className="mb-4 p-2 w-full border rounded-md"
        />

        <div className="flex justify-center space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-cafe-claro hover:text-cafe-oscuro"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center px-4 py-2 bg-cafe-medio text-white rounded-md hover:bg-cafe-oscuro focus:outline-none focus:ring-2 focus:ring-cafe-intenso"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
