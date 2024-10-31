"use client";

import React, { useState, useEffect } from "react";
import {
  TrashIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../credenciales";

export default function NuevaOrden() {
  const [orderItems, setOrderItems] = useState([]);
  const [waiterName, setWaiterName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [orderDate, setOrderDate] = useState(new Date());
  const [orderStatus, setOrderStatus] = useState("activated");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [invoice, setInvoice] = useState("no");
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(true);
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const email = user.email;
      const firstName = email.split("@")[0];
      setWaiterName(firstName.charAt(0).toUpperCase() + firstName.slice(1));
    }

    const checkSideMenuVisibility = () => {
      setIsSideMenuVisible(window.innerWidth >= 640);
    };

    checkSideMenuVisibility();
    window.addEventListener("resize", checkSideMenuVisibility);

    return () => {
      window.removeEventListener("resize", checkSideMenuVisibility);
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "productos");
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().nombre,
          price: doc.data().precio,
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error al obtener productos: ", error);
        alert("No se pudieron cargar los productos. Intenta nuevamente.");
      }
    };

    fetchProducts();
  }, []);

  const toggleProductSelection = (product) => {
    setSelectedProducts((prevSelected) => {
      if (prevSelected.some((p) => p.id === product.id)) {
        return prevSelected.filter((p) => p.id !== product.id);
      } else {
        return [...prevSelected, product];
      }
    });
  };

  const addSelectedProductsToOrder = () => {
    const newOrderItems = selectedProducts.map((product) => ({
      quantity: 1,
      name: product.name,
      details: "",
      price: product.price,
    }));
    setOrderItems([...orderItems, ...newOrderItems]);
    setSelectedProducts([]);
    setIsModalVisible(false);
  };

  const addOrderItem = () => {
    if (selectedProduct) {
      setOrderItems([
        ...orderItems,
        {
          quantity: 1,
          name: selectedProduct.name,
          details: "",
          price: selectedProduct.price,
        },
      ]);
      setSelectedProduct(null);
      setIsModalVisible(false);
    }
  };

  const updateOrderItem = (index, field, value) => {
    const newOrderItems = [...orderItems];
    if (field === "quantity" && (parseInt(value) <= 0 || isNaN(value))) {
      return;
    }
    if (field === "price" && parseFloat(value) < 0) {
      return;
    }
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
      .reduce(
        (total, item) =>
          total +
          (parseFloat(item.quantity) || 1) * (parseFloat(item.price) || 0),
        0
      )
      .toFixed(2);
  };

  const saveOrderToFirestore = async () => {
    if (!tableNumber) {
      alert("Por favor, selecciona un número de mesa.");
      return;
    }
    if (orderItems.length === 0) {
      alert("Agrega al menos un producto a la orden.");
      return;
    }
    try {
      await addDoc(collection(db, "ordenes"), {
        mesero: waiterName,
        numeroMesa: tableNumber,
        fechaHora: new Date(),
        productos: orderItems.map((item) => ({
          cantidad: item.quantity,
          nombre: item.name,
          detalles: item.details || "",
          precio: item.price,
        })),
        total: parseFloat(calculateTotal()),
        estado: orderStatus,
        metodoPago: paymentMethod,
        factura: invoice,
      });
      alert("Orden agregada exitosamente!");
      // Reiniciar los campos del formulario
      setOrderItems([]);
      setTableNumber("");
      setOrderDate(new Date());
      setOrderStatus("activated");
      setPaymentMethod("cash");
      setInvoice("no");
    } catch (error) {
      console.error("Error al agregar la orden: ", error);
    }
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
    "A5",
    "A6",
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "finished":
        return "bg-gray-100 text-gray-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "activated":
        return "bg-green-100 text-green-800";
      default:
        return "";
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-cafe-suave to-cafe-claro p-4 md:p-8 ${
        isSideMenuVisible ? "sm:ml-16 lg:ml-64" : ""
      }`}
    >
      <div className="mx-auto bg-white rounded-xl shadow-lg p-6 space-y-8 max-w-8xl">
        <h1 className="text-3xl font-bold text-cafe-oscuro mb-6 text-center">
          Nueva Orden
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="waiterName"
                className="block text-sm font-medium text-cafe-oscuro mb-1"
              >
                Mesero
              </label>
              <input
                type="text"
                id="waiterName"
                value={waiterName}
                readOnly
                className="w-full px-3 py-2 bg-cafe-claro/20 border border-cafe-medio/20 rounded-lg text-cafe-oscuro placeholder-cafe-medio/50 focus:outline-none focus:ring-2 focus:ring-cafe-intenso focus:border-transparent transition duration-200"
              />
            </div>
            <div>
              <label
                htmlFor="tableNumber"
                className="block text-sm font-medium text-cafe-oscuro mb-1"
              >
                Número de mesa
              </label>
              <select
                id="tableNumber"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-3 py-2 bg-cafe-claro/20 border border-cafe-medio/20 rounded-lg text-cafe-oscuro focus:outline-none focus:ring-2 focus:ring-cafe-intenso focus:border-transparent transition duration-200"
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
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-cafe-oscuro mb-1">
                Fecha y Hora
              </p>
              <p className="px-3 py-2 bg-cafe-claro/20 border border-cafe-medio/20 rounded-lg text-cafe-oscuro">
                {orderDate.toLocaleString()}
              </p>
            </div>
            <div>
              <label
                htmlFor="orderStatus"
                className="block text-sm font-medium text-cafe-oscuro mb-1"
              >
                Estado de la Orden
              </label>
              <select
                id="orderStatus"
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className={`w-full px-3 py-2 border border-cafe-medio/20 rounded-lg text-cafe-oscuro focus:outline-none focus:ring-2 focus:ring-cafe-intenso focus:border-transparent transition duration-200 ${getStatusColor(
                  orderStatus
                )}`}
              >
                <option value="activated">Activa</option>
                <option value="finished">Finalizada</option>
                <option value="canceled">Cancelada</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cafe-oscuro">
              Productos
            </h2>
            <button
              onClick={() => setIsModalVisible(true)}
              className="bg-cafe-oscuro text-white px-4 py-2 rounded-lg hover:bg-cafe-intenso transition duration-200 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Agregar Producto</span>
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-cafe-medio/20">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-cafe-suave text-cafe-oscuro text-left">
                  <th className="p-3 font-semibold">Cantidad</th>
                  <th className="p-3 font-semibold">Nombre</th>
                  <th className="p-3 font-semibold">Detalles</th>
                  <th className="p-3 font-semibold">Precio</th>
                  <th className="p-3 font-semibold">Tirar</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item, index) => (
                  <tr key={index} className="border-t border-cafe-claro/20">
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => adjustQuantity(index, -1)}
                          className="text-cafe-oscuro hover:text-cafe-intenso transition duration-200"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => adjustQuantity(index, 1)}
                          className="text-cafe-oscuro hover:text-cafe-intenso transition duration-200"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          updateOrderItem(index, "name", e.target.value)
                        }
                        className="w-full px-2 py-1 bg-transparent border-b border-cafe-medio/20 focus:border-cafe-intenso focus:outline-none transition duration-200"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={item.details}
                        onChange={(e) =>
                          updateOrderItem(index, "details", e.target.value)
                        }
                        className="w-full px-2 py-1 bg-transparent border-b border-cafe-medio/20 focus:border-cafe-intenso focus:outline-none transition duration-200"
                      />
                    </td>
                    <td className="p-3">
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
                        className="w-full px-2 py-1 bg-transparent border-b border-cafe-medio/20 focus:border-cafe-intenso focus:outline-none transition duration-200"
                      />
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => removeOrderItem(index)}
                        className="text-red-500 hover:text-red-700 transition duration-200"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <h3 className="text-xl font-semibold text-cafe-oscuro">
              Total: ${calculateTotal()}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="paymentMethod"
              className="block text-sm font-medium text-cafe-oscuro mb-1"
            >
              Método de Pago
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 bg-cafe-claro/20 border border-cafe-medio/20 rounded-lg text-cafe-oscuro focus:outline-none focus:ring-2 focus:ring-cafe-intenso focus:border-transparent transition duration-200"
            >
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="invoice"
              className="block text-sm font-medium text-cafe-oscuro mb-1"
            >
              Facturada
            </label>
            <select
              id="invoice"
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
              className="w-full px-3 py-2 bg-cafe-claro/20 border border-cafe-medio/20 rounded-lg text-cafe-oscuro focus:outline-none focus:ring-2 focus:ring-cafe-intenso focus:border-transparent transition duration-200"
            >
              <option value="yes">Si</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        <button
          onClick={saveOrderToFirestore}
          className="w-full px-4 py-3 bg-cafe-oscuro text-white rounded-lg hover:bg-cafe-intenso focus:outline-none focus:ring-2 focus:ring-cafe-medio focus:ring-offset-2 transition duration-200 text-lg font-semibold"
        >
          Agregar Orden
        </button>
      </div>

      {/* Modal para seleccionar productos */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-cafe-oscuro">
                Selecciona Productos
              </h2>
              <button
                onClick={() => setIsModalVisible(false)}
                className="text-cafe-oscuro hover:text-cafe-intenso transition duration-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <ul className="space-y-2">
                {products.map((product) => (
                  <li
                    key={product.id}
                    className="flex justify-between items-center border-b border-cafe-claro/20 pb-2"
                  >
                    <span className="text-cafe-oscuro">
                      {product.name} - ${product.price}
                    </span>
                    <input
                      type="checkbox"
                      checked={selectedProducts.some(
                        (p) => p.id === product.id
                      )}
                      onChange={() => toggleProductSelection(product)}
                      className="form-checkbox h-5 w-5 text-cafe-intenso rounded focus:ring-cafe-intenso"
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <button
                onClick={addSelectedProductsToOrder}
                className="bg-cafe-oscuro text-white px-4 py-2 rounded-lg hover:bg-cafe-intenso transition duration-200"
              >
                Agregar Seleccionados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
