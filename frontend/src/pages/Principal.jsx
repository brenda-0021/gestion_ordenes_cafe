"use client";

import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../credenciales";
import { Button } from "../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { ScrollArea } from "../components/scroll-area";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  TableCellsIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

export default function Principal() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("activated");

  useEffect(() => {
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
    const q = query(collection(db, "ordenes"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, []);

  const filterOrders = (status) => {
    return orders.filter((order) => order.estado === status);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "activated":
        return <ClockIcon className="h-5 w-5 text-green-600" />;
      case "finished":
        return <CheckCircleIcon className="h-5 w-5 text-gray-600" />;
      case "canceled":
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "activated":
        return "bg-green-100 text-green-800 border-green-200";
      case "finished":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "";
    }
  };

  const OrderCard = ({ order }) => (
    <Card
      className={`mb-4 hover:shadow-lg transition-shadow duration-200 ${getStatusColor(
        order.estado
      )}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <TableCellsIcon className="h-5 w-5 text-cafe-oscuro" />
            <span className="font-semibold">Mesa {order.numeroMesa}</span>
          </div>
          <div className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-cafe-oscuro" />
            <span>{order.mesero}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-cafe-medio">
          <div className="flex items-center space-x-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{order.fechaHora.toDate().toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <CurrencyDollarIcon className="h-4 w-4" />
            <span>${order.total}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full mt-2 text-cafe-oscuro hover:bg-cafe-claro/50"
          onClick={() => setSelectedOrder(order)}
        >
          Ver detalles
        </Button>
      </CardContent>
    </Card>
  );

  const closeModal = () => setSelectedOrder(null);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-cafe-suave to-cafe-claro p-4 md:p-8 ${
        isSideMenuVisible ? "sm:ml-16 lg:ml-64" : ""
      }`}
    >
      <div className="mx-auto bg-white rounded-xl shadow-xl p-6 max-w-8xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-cafe-intenso flex items-center gap-2">
            <ClipboardDocumentListIcon className="h-8 w-8" />
            Gestión de Ordenes
          </h1>
          <div className="flex gap-2">
            <span className="hidden md:flex items-center gap-1 text-sm text-cafe-medio">
              <ClockIcon className="h-4 w-4" />
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Tabs para móvil */}
        <div className="flex overflow-x-auto mb-6 -mx-6 px-6 md:hidden">
          <button
            onClick={() => setActiveTab("activated")}
            className={`flex items-center px-4 py-2 whitespace-nowrap rounded-lg mr-2 ${
              activeTab === "activated"
                ? "bg-green-100 text-green-800"
                : "bg-cafe-claro/20 text-cafe-medio"
            }`}
          >
            <ClockIcon className="h-5 w-5 mr-1" />
            Activas ({filterOrders("activated").length})
          </button>
          <button
            onClick={() => setActiveTab("finished")}
            className={`flex items-center px-4 py-2 whitespace-nowrap rounded-lg mr-2 ${
              activeTab === "finished"
                ? "bg-gray-100 text-gray-800"
                : "bg-cafe-claro/20 text-cafe-medio"
            }`}
          >
            <CheckCircleIcon className="h-5 w-5 mr-1" />
            Finalizadas ({filterOrders("finished").length})
          </button>
          <button
            onClick={() => setActiveTab("canceled")}
            className={`flex items-center px-4 py-2 whitespace-nowrap rounded-lg ${
              activeTab === "canceled"
                ? "bg-red-100 text-red-800"
                : "bg-cafe-claro/20 text-cafe-medio"
            }`}
          >
            <XCircleIcon className="h-5 w-5 mr-1" />
            Canceladas ({filterOrders("canceled").length})
          </button>
        </div>

        {/* Vista móvil */}
        <div className="md:hidden">
          <ScrollArea className="h-[calc(100vh-250px)]">
            {filterOrders(activeTab).map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </ScrollArea>
        </div>

        {/* Vista desktop */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-green-700 mb-4">
              <ClockIcon className="h-5 w-5" />
              Ordenes Activas ({filterOrders("activated").length})
            </h2>
            <ScrollArea className="h-[calc(100vh-200px)]">
              {filterOrders("activated").map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </ScrollArea>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
              <CheckCircleIcon className="h-5 w-5" />
              Ordenes Finalizadas ({filterOrders("finished").length})
            </h2>
            <ScrollArea className="h-[calc(100vh-200px)]">
              {filterOrders("finished").map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </ScrollArea>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-red-700 mb-4">
              <XCircleIcon className="h-5 w-5" />
              Ordenes Canceladas ({filterOrders("canceled").length})
            </h2>
            <ScrollArea className="h-[calc(100vh-200px)]">
              {filterOrders("canceled").map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </ScrollArea>
          </div>
        </div>

        {/* Modal de detalles */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-lg bg-white">
              <CardHeader className="relative border-b border-cafe-claro/20">
                <CardTitle className="flex items-center gap-2 text-cafe-intenso">
                  <ClipboardDocumentListIcon className="h-6 w-6" />
                  Detalles de la Orden
                </CardTitle>
                <button
                  onClick={closeModal}
                  className="absolute right-6 top-6 text-cafe-medio hover:text-cafe-oscuro transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <TableCellsIcon className="h-5 w-5 text-cafe-medio" />
                    <span className="text-cafe-oscuro">
                      Mesa: {selectedOrder.numeroMesa}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-cafe-medio" />
                    <span className="text-cafe-oscuro">
                      Mesero: {selectedOrder.mesero}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-cafe-medio" />
                    <span className="text-cafe-oscuro">
                      {selectedOrder.fechaHora.toDate().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedOrder.estado)}
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                        selectedOrder.estado
                      )}`}
                    >
                      {selectedOrder.estado}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-cafe-oscuro flex items-center gap-2">
                    <ClipboardDocumentListIcon className="h-5 w-5" />
                    Productos
                  </h3>
                  <div className="bg-cafe-claro/10 rounded-lg p-4 space-y-2">
                    {selectedOrder.productos.map((producto, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-cafe-oscuro"
                      >
                        <span>
                          {producto.cantidad} x {producto.nombre}
                        </span>
                        <span>${producto.precio}</span>
                      </div>
                    ))}
                    <div className="border-t border-cafe-claro/20 mt-4 pt-4 flex justify-between items-center font-semibold">
                      <span>Total</span>
                      <span>${selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
