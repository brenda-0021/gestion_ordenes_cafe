"use client";

import React, { useState, useEffect } from "react";
import { TrashIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/solid";

export default function NuevaOrden() {
  const [orderItems, setOrderItems] = useState([]);
  const [waiterName, setWaiterName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [orderDate, setOrderDate] = useState(new Date());
  const [orderStatus, setOrderStatus] = useState("activated");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [invoice, setInvoice] = useState("no");

  useEffect(() => {
    const simulatedWaiterName = "Juan Pérez";
    setWaiterName(simulatedWaiterName);
  }, []);

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      { quantity: 1, name: "", details: "", price: 0 },
    ]);
  };

  const updateOrderItem = (index, field, value) => {
    const newOrderItems = [...orderItems];
    newOrderItems[index][field] = value;
    setOrderItems(newOrderItems);
  };

  const removeOrderItem = (index) => {
    const newOrderItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(newOrderItems);
  };

  const adjustQuantity = (index, amount) => {
    const newOrderItems = [...orderItems];
    newOrderItems[index].quantity = Math.max(
      1,
      newOrderItems[index].quantity + amount
    );
    setOrderItems(newOrderItems);
  };

  const calculateTotal = () => {
    return orderItems
      .reduce((total, item) => total + item.quantity * item.price, 0)
      .toFixed(2);
  };

  const tableOptions = [
    "01",
    "02",
    "03",
    "04",
    "A",
    "B",
    "A1",
    "A2",
    "A3",
    "A4",
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "finished":
        return "bg-gray-300";
      case "canceled":
        return "bg-red-300";
      case "activated":
        return "bg-green-300";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-cafe-suave p-4 md:p-8">
      <div className="mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-cafe-oscuro mb-6">
          Nueva Orden
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="waiterName"
              className="block text-sm font-medium text-cafe-oscuro"
            >
              Mesero
            </label>
            <input
              type="text"
              id="waiterName"
              value={waiterName}
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-cafe-claro border border-cafe-medio rounded-md text-cafe-oscuro placeholder-cafe-medio focus:outline-none focus:ring-cafe-intenso focus:border-cafe-intenso"
            />
          </div>
          <div>
            <label
              htmlFor="tableNumber"
              className="block text-sm font-medium text-cafe-oscuro"
            >
              Numero de mesa
            </label>
            <select
              id="tableNumber"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-cafe-claro border border-cafe-medio rounded-md text-cafe-oscuro focus:outline-none focus:ring-cafe-intenso focus:border-cafe-intenso"
            >
              <option value="">Selecciona una mesa</option>
              {tableOptions.map((table) => (
                <option key={table} value={table}>
                  {table}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-cafe-oscuro">
            Fecha y Hora: {orderDate.toLocaleString()}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-cafe-oscuro mb-2">
            Productos
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-cafe-medio text-white text-center">
                <th className="p-2 w-24">Cantidad</th>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Detalles</th>
                <th className="p-2 text-left">Precio</th>
                <th className="p-2 w-16">Borrar</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, index) => (
                <tr key={index} className="border-b border-cafe-claro">
                  <td className="p-2">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => adjustQuantity(index, -1)}
                        className="text-cafe-oscuro hover:text-cafe-intenso"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        onClick={() => adjustQuantity(index, 1)}
                        className="text-cafe-oscuro hover:text-cafe-intenso"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        updateOrderItem(index, "name", e.target.value)
                      }
                      className="w-full px-2 py-1 bg-cafe-claro border border-cafe-medio rounded-md text-cafe-oscuro"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.details}
                      onChange={(e) =>
                        updateOrderItem(index, "details", e.target.value)
                      }
                      className="w-full px-2 py-1 bg-cafe-claro border border-cafe-medio rounded-md text-cafe-oscuro"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        updateOrderItem(
                          index,
                          "price",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full px-2 py-1 bg-cafe-claro border border-cafe-medio rounded-md text-cafe-oscuro"
                    />
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => removeOrderItem(index)}
                      className="flex items-center justify-center w-full text-cafe-oscuro hover:text-cafe-intenso"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addOrderItem}
            className="mt-4 px-4 py-2 bg-cafe-medio text-white rounded-md hover:bg-cafe-oscuro focus:outline-none focus:ring-2 focus:ring-cafe-intenso"
          >
            Nuevo Producto
          </button>
        </div>

        <div className="mb-6 text-right">
          <p className="text-xl font-semibold text-cafe-oscuro">
            Total: ${calculateTotal()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label
              htmlFor="orderStatus"
              className="block text-sm font-medium text-cafe-oscuro"
            >
              Estado de la Orden
            </label>
            <select
              id="orderStatus"
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border border-cafe-medio rounded-md text-cafe-oscuro focus:outline-none focus:ring-cafe-intenso focus:border-cafe-intenso ${getStatusColor(
                orderStatus
              )}`}
            >
              <option value="activated">Activa</option>
              <option value="finished">Finalizada</option>
              <option value="canceled">Cancelada</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="paymentMethod"
              className="block text-sm font-medium text-cafe-oscuro"
            >
              Método de Pago
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-cafe-claro border border-cafe-medio rounded-md text-cafe-oscuro focus:outline-none focus:ring-cafe-intenso focus:border-cafe-intenso"
            >
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="invoice"
              className="block text-sm font-medium text-cafe-oscuro"
            >
              Facturada
            </label>
            <select
              id="invoice"
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-cafe-claro border border-cafe-medio rounded-md text-cafe-oscuro focus:outline-none focus:ring-cafe-intenso focus:border-cafe-intenso"
            >
              <option value="yes">Si</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        <button className="w-full px-4 py-2 bg-cafe-oscuro text-white rounded-md hover:bg-cafe-intenso focus:outline-none focus:ring-2 focus:ring-cafe-medio">
          Agregar Orden
        </button>
      </div>
    </div>
  );
}
