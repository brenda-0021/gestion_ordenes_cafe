"use client";

import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../credenciales";
import { Button } from "../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { ScrollArea } from "../components/scroll-area";

export default function Principal() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(true);

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

  const OrderColumn = ({ title, status, bgColor }) => (
    <Card className={`flex-1 ${bgColor}`}>
      <CardHeader>
        <CardTitle className="text-cafe-intenso">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {filterOrders(status).map((order) => (
            <Button
              key={order.id}
              variant="ghost"
              className="w-full justify-start mb-2 text-left text-cafe-oscuro hover:bg-cafe-claro"
              onClick={() => setSelectedOrder(order)}
            >
              Mesa: {order.numeroMesa} | Mesero: {order.mesero}
            </Button>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const closeModal = () => setSelectedOrder(null);

  return (
    <div
      className={`min-h-screen bg-cafe-suave p-4 md:p-8 ${
        isSideMenuVisible ? "sm:ml-16 lg:ml-64" : ""
      }`}
    >
      <div className="mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-8 text-cafe-intenso">
          Gestión de Ordenes
        </h1>
        <div className="flex flex-col md:flex-row gap-8">
          <OrderColumn
            title="Ordenes Activas"
            status="activated"
            bgColor="bg-green-200" // Verde para órdenes activas
          />
          <OrderColumn
            title="Ordenes Finalizadas"
            status="finished"
            bgColor="bg-gray-300" // Gris para órdenes finalizadas
          />
          <OrderColumn
            title="Ordenes Canceladas"
            status="canceled"
            bgColor="bg-red-300" // Rojo para órdenes canceladas
          />
        </div>

        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <Card className="max-w-md mx-auto bg-white">
              <CardHeader>
                <CardTitle className="text-cafe-intenso">
                  Detalles de la Orden
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cafe-oscuro">
                  Mesa: {selectedOrder.numeroMesa}
                </p>
                <p className="text-cafe-oscuro">
                  Mesero: {selectedOrder.mesero}
                </p>
                <p className="text-cafe-oscuro">
                  Fecha/Hora:{" "}
                  {selectedOrder.fechaHora.toDate().toLocaleString()}
                </p>
                <p className="text-cafe-oscuro">
                  Estado: {selectedOrder.estado}
                </p>
                <h2 className="mt-4 font-semibold">Productos:</h2>
                <ul>
                  {selectedOrder.productos.map((producto, index) => (
                    <li key={index} className="text-cafe-oscuro">
                      {producto.cantidad} x {producto.nombre} - $
                      {producto.precio}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 font-semibold">
                  Total: ${selectedOrder.total}
                </p>
              </CardContent>
              <Button variant="ghost" onClick={closeModal} className="m-4">
                Cerrar
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
