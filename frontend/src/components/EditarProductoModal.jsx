"use client";

import React, { useEffect, useState } from "react";

const EditarProductoModal = ({ isOpen, onClose, onEditProduct, product }) => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [tipo, setTipo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && product) {
      setNombre(product.nombre);
      setPrecio(product.precio.toString());
      setTipo(product.tipo || "");
      setError("");
    }
  }, [isOpen, product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim()) {
      setError("El nombre del producto es requerido.");
      return;
    }

    const precioNum = parseFloat(precio);
    if (isNaN(precioNum) || precioNum < 0) {
      setError("El precio debe ser un número válido y no negativo.");
      return;
    }

    if (!tipo) {
      setError("El tipo de producto es requerido.");
      return;
    }

    onEditProduct({
      ...product,
      nombre: nombre.trim(),
      precio: precioNum,
      tipo,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-lg shadow-md p-6 w-96">
        <h2
          id="modal-title"
          className="text-xl font-bold text-cafe-oscuro text-center mb-4"
        >
          Editar Producto
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-cafe-medio focus:border-cafe-medio"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="precio"
              className="block text-sm font-medium text-gray-700"
            >
              Precio
            </label>
            <input
              type="number"
              id="precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-cafe-medio focus:border-cafe-medio"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="tipo"
              className="block text-sm font-medium text-gray-700"
            >
              Tipo de Producto
            </label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-cafe-medio focus:border-cafe-medio"
              required
            >
              <option value="">Seleccione un tipo</option>
              <option value="bebidas frias">Bebidas Frías</option>
              <option value="bebidas calientes">Bebidas Calientes</option>
              <option value="desayunos">Desayunos</option>
              <option value="postres">Postres</option>
            </select>
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-4" role="alert">
              {error}
            </p>
          )}
          <div className="flex justify-center space-x-2">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-cafe-medio text-white rounded-md hover:bg-cafe-oscuro focus:outline-none focus:ring-2 focus:ring-cafe-intenso"
            >
              Guardar
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

export default EditarProductoModal;
