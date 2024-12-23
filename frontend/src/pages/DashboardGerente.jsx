"use client";

import React, { useEffect, useState, useCallback } from "react";
import NuevoMeseroModal from "../components/NuevoMeseroModal";
import NuevoProductoModal from "../components/NuevoProducctoModal";
import EditarProductoModal from "../components/EditarProductoModal";
import { db } from "../credenciales";
import axios from "axios";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  Timestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import {
  PlusIcon,
  TrashIcon,
  ChartBarIcon,
  CakeIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  BanknotesIcon,
  ReceiptRefundIcon,
  ShoppingCartIcon,
  SparklesIcon,
  PencilSquareIcon,
  UserIcon,
  CurrencyDollarIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState("reports");
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(true);
  const [waiters, setWaiters] = useState([
    { id: 1, name: "Juan Pérez" },
    { id: 2, name: "María García" },
  ]);
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const [dailyReport, setDailyReport] = useState(null);
  const [previousReports, setPreviousReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [resumenVentas, setResumenVentas] = useState("");

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

  const fetchProducts = useCallback(async () => {
    try {
      const productsCollection = collection(db, "productos");
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      productsList.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setProducts(productsList);
    } catch (error) {
      console.error("Error al obtener productos: ", error);
    }
  }, []);

  const fetchPreviousReports = useCallback(async () => {
    try {
      const reportsCollection = collection(db, "reportes");
      const q = query(reportsCollection, orderBy("fecha", "desc"), limit(10));
      const reportsSnapshot = await getDocs(q);
      const reportsList = reportsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPreviousReports(reportsList);
    } catch (error) {
      console.error("Error al obtener reportes anteriores: ", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchPreviousReports();
  }, [fetchProducts, fetchPreviousReports]);

  const generateDailyReport = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const ordersRef = collection(db, "ordenes");
    const q = query(
      ordersRef,
      where("fechaHora", ">=", Timestamp.fromDate(today)),
      where("fechaHora", "<", Timestamp.fromDate(tomorrow))
    );

    try {
      const querySnapshot = await getDocs(q);
      let totalOrders = 0;
      let totalSales = 0;
      let canceledOrders = 0;
      let paymentMethods = { efectivo: 0, tarjeta: 0 };
      let invoicesIssued = 0;
      let salesByWaiter = {};
      let productsSold = {};

      querySnapshot.forEach((doc) => {
        const order = doc.data();
        console.log("Order data:", order); // Debug log

        if (order.estado === "finished") {
          totalOrders++;
          totalSales += parseFloat(order.total) || 0;

          // Update payment method counting
          if (order.metodoPago === "cash") {
            paymentMethods.efectivo++;
          } else if (order.metodoPago === "card") {
            paymentMethods.tarjeta++;
          }

          if (order.factura === "yes") invoicesIssued++;

          if (!salesByWaiter[order.mesero]) {
            salesByWaiter[order.mesero] = { orders: 0, sales: 0, invoices: 0 };
          }
          salesByWaiter[order.mesero].orders++;
          salesByWaiter[order.mesero].sales += parseFloat(order.total) || 0;
          if (order.factura === "yes") salesByWaiter[order.mesero].invoices++;

          order.productos.forEach((product) => {
            if (!productsSold[product.nombre]) {
              productsSold[product.nombre] = { quantity: 0, sales: 0 };
            }
            productsSold[product.nombre].quantity +=
              parseInt(product.cantidad) || 0;
            productsSold[product.nombre].sales +=
              parseFloat(product.precio) * (parseInt(product.cantidad) || 0);
          });
        } else if (order.estado === "canceled") {
          canceledOrders++;
        }
      });

      console.log("Total orders:", totalOrders); // Debug log
      console.log("Total sales:", totalSales); // Debug log
      console.log("Payment methods:", paymentMethods); // Debug log

      const topProducts = Object.entries(productsSold)
        .sort((a, b) => b[1].quantity - a[1].quantity)
        .slice(0, 5);

      const reportData = {
        fecha: today.toLocaleDateString(),
        ordenesFinalizadas: totalOrders,
        ordenesCanceladas: canceledOrders,
        totalVentas: totalSales.toFixed(2),
        metodosPago: paymentMethods,
        facturasEmitidas: invoicesIssued,
        ventasPorMesero: Object.fromEntries(
          Object.entries(salesByWaiter).map(([mesero, data]) => [
            mesero,
            {
              ...data,
              sales: data.sales.toFixed(2),
            },
          ])
        ),
        topProductos: topProducts.map(([nombre, data]) => ({
          nombre,
          cantidad: data.quantity,
          ventas: data.sales.toFixed(2),
        })),
      };

      console.log("Datos del reporte generado:", reportData);

      const docRef = await addDoc(collection(db, "reportes"), reportData);
      console.log("Reporte guardado exitosamente en Firebase.");

      // Update reportData with the new document ID
      const reportDataWithId = { ...reportData, id: docRef.id };
      setDailyReport(reportDataWithId);

      await generarReporte(reportDataWithId);

      fetchPreviousReports();
    } catch (error) {
      console.error("Error al generar el reporte diario:", error);
    }
  };

  const generarReporte = async (reportData) => {
    try {
      if (!reportData) {
        console.error("No hay datos para generar el reporte.");
        return;
      }

      // Format the data in a more natural language way
      const reportDataString = `
      Resumen de ventas del día ${reportData.fecha}:
      
      Resumen General:
      - Total de órdenes finalizadas: ${reportData.ordenesFinalizadas}
      - Total de órdenes canceladas: ${reportData.ordenesCanceladas}
      - Ventas totales del día: $${reportData.totalVentas} MXN
      
      Métodos de Pago:
      - Efectivo: ${reportData.metodosPago.efectivo || 0} órdenes
      - Tarjeta: ${reportData.metodosPago.tarjeta || 0} órdenes
      - Cash: ${reportData.metodosPago.cash || 0} órdenes
      
      Facturas emitidas: ${reportData.facturasEmitidas}
      
      Desempeño por Mesero:
      ${Object.entries(reportData.ventasPorMesero)
        .map(
          ([mesero, data]) =>
            `- ${mesero}: ${data.orders} órdenes, $${data.sales} MXN`
        )
        .join("\n")}
      
      Productos Más Vendidos:
      ${reportData.topProductos
        .map(
          (product) =>
            `- ${product.nombre}: ${product.cantidad} unidades, $${product.ventas} MXN`
        )
        .join("\n")}
    `;

      console.log("Enviando datos para generar reporte:", reportDataString);

      const response = await axios.post("http://localhost:5000/api/gemini", {
        message: `Analiza el siguiente resumen de ventas y genera un informe ejecutivo con observaciones, predicciones y recomendaciones. No repitas la información proporcionada, sino interpreta los datos para ofrecer insights valiosos. Enfócate en tendencias, patrones inusuales, oportunidades de mejora y posibles estrategias para aumentar las ventas. Usa un lenguaje claro y conciso, evitando términos técnicos. El informe debe ser fácilmente comprensible para alguien sin conocimientos de negocios o informática.

    Estructura el informe de la siguiente manera:
    1. Observaciones clave (3-4 puntos)
    2. Predicciones a corto plazo (2-3 puntos)
    3. Recomendaciones para mejorar el rendimiento (3-4 puntos)

    Datos del día:
    ${reportDataString}`,
      });

      if (response.data) {
        const resumenGemini = response.data;
        setResumenVentas(resumenGemini);

        if (reportData.id) {
          const reporteRef = doc(db, "reportes", reportData.id);
          await updateDoc(reporteRef, {
            resumenGemini: resumenGemini,
          });
          console.log("Resumen de Gemini guardado en Firebase");
        } else {
          console.error(
            "No se pudo guardar el resumen en Firebase: ID del reporte no disponible"
          );
        }
      } else {
        throw new Error("No se recibió respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      setResumenVentas(
        "No se pudo generar el resumen automático. Por favor revise los datos manualmente."
      );
    }
  };

  const handleOpenNewProductModal = () => {
    setIsNewProductModalOpen(true);
  };

  const deleteProductFromDB = async (id) => {
    try {
      const productRef = doc(db, "productos", id);
      await deleteDoc(productRef);
      console.log(`Producto con ID ${id} eliminado de la base de datos`);
    } catch (error) {
      console.error(
        "Error al eliminar el producto de la base de datos:",
        error
      );
    }
  };

  const handleOpenEditProductModal = (product) => {
    setProductToEdit(product);
    setIsEditProductModalOpen(true);
  };

  const handleEditProduct = async (productData) => {
    if (
      !productData ||
      !productData.id ||
      !productData.nombre ||
      isNaN(productData.precio) ||
      !productData.tipo
    ) {
      console.error("ID, nombre, precio o tipo inválidos");
      return;
    }

    try {
      const productRef = doc(db, "productos", productData.id);
      await updateDoc(productRef, {
        nombre: productData.nombre,
        precio: parseFloat(productData.precio) || 0,
        tipo: productData.tipo,
      });

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productData.id
            ? {
                ...product,
                nombre: productData.nombre,
                precio: parseFloat(productData.precio) || 0,
                tipo: productData.tipo,
              }
            : product
        )
      );
      console.log("Producto editado:", productData);
      setIsEditProductModalOpen(false);
    } catch (error) {
      console.error("Error editando producto: ", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    await deleteProductFromDB(id);
    setProducts(products.filter((product) => product.id !== id));
  };

  const addWaiterFromModal = (waiterData) => {
    setWaiters([...waiters, { id: Date.now(), name: waiterData.nombre }]);
    setIsWaiterModalOpen(false);
  };

  const addProductFromModal = async (productData) => {
    if (!productData.nombre || isNaN(productData.precio) || !productData.tipo) {
      console.error("Nombre, precio o tipo inválidos");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "productos"), {
        nombre: productData.nombre,
        precio: parseFloat(productData.precio) || 0,
        tipo: productData.tipo, // Nuevo campo tipo
      });

      setProducts((prevProducts) => [
        ...prevProducts,
        {
          id: docRef.id,
          nombre: productData.nombre,
          precio: parseFloat(productData.precio) || 0,
          tipo: productData.tipo, // Agregar tipo en el estado
        },
      ]);
      console.log("Producto agregado:", {
        nombre: productData.nombre,
        precio: parseFloat(productData.precio) || 0,
        tipo: productData.tipo, // Mostrar tipo en el log
      });

      setIsNewProductModalOpen(false);
    } catch (error) {
      console.error("Error agregando producto: ", error);
    }
  };

  const closeWaiterModal = () => {
    setIsWaiterModalOpen(false);
  };

  const closeNewProductModal = () => {
    setIsNewProductModalOpen(false);
  };

  const closeEditProductModal = () => {
    setIsEditProductModalOpen(false);
    setProductToEdit(null);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setSelectedReport(null);
  };

  const formatResumenGemini = (resumen) => {
    return resumen
      .replace(/\*\*/g, "")
      .split("\n")
      .map((line, index) => (
        <p key={index} className="mb-2">
          {line}
        </p>
      ));
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-cafe-suave to-cafe-claro p-4 md:p-8 ${
        isSideMenuVisible ? "sm:ml-16 lg:ml-64" : ""
      }`}
    >
      <div className="mx-auto bg-white rounded-xl shadow-lg p-6 max-w-8xl">
        <h1 className="text-3xl font-bold text-cafe-oscuro mb-8">
          Panel del Gerente
        </h1>

        <div className="flex flex-wrap mb-8">
          <button
            onClick={() => setActiveTab("reports")}
            className={`mr-4 mb-2 px-6 py-3 rounded-lg flex items-center transition-colors duration-300 ${
              activeTab === "reports"
                ? "bg-cafe-oscuro text-white"
                : "bg-cafe-claro text-cafe-oscuro hover:bg-cafe-medio hover:text-white"
            }`}
          >
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Reportes
          </button>
          {/*<button
            onClick={() => setActiveTab("waiters")}
            className={`mr-4 mb-2 px-6 py-3 rounded-lg flex items-center transition-colors duration-300 ${
              activeTab === "waiters"
                ? "bg-cafe-oscuro text-white"
                : "bg-cafe-claro text-cafe-oscuro hover:bg-cafe-medio hover:text-white"
            }`}
          >
            <UserIcon className="h-5 w-5 mr-2" />
            Meseros
          </button>*/}
          <button
            onClick={() => setActiveTab("products")}
            className={`mr-4 mb-2 px-6 py-3 rounded-lg flex items-center transition-colors duration-300 ${
              activeTab === "products"
                ? "bg-cafe-oscuro text-white"
                : "bg-cafe-claro text-cafe-oscuro hover:bg-cafe-medio hover:text-white"
            }`}
          >
            <CakeIcon className="h-5 w-5 mr-2" />
            Productos
          </button>
        </div>

        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-cafe-oscuro flex items-center">
                <ChartBarIcon className="h-7 w-7 mr-2 text-cafe-medio" />
                Reportes
              </h2>
              <button
                onClick={generateDailyReport}
                className="flex items-center px-6 py-3 bg-cafe-medio text-white font-bold rounded-lg hover:bg-cafe-oscuro transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cafe-intenso focus:ring-offset-2"
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                Generar reporte del día
              </button>
            </div>
            <div className="bg-cafe-claro/30 p-6 rounded-lg shadow-inner">
              <div className="overflow-y-auto max-h-[400px] pr-4">
                {previousReports.map((report, index) => (
                  <div key={report.id}>
                    <div
                      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer mb-4"
                      onClick={() => handleViewReport(report)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <CalendarIcon className="h-5 w-5 mr-2 text-cafe-medio" />
                          <span className="font-medium text-cafe-oscuro">
                            {report.fecha}
                          </span>
                        </div>
                        <span className="bg-cafe-claro text-cafe-oscuro px-3 py-1 rounded-full text-sm font-semibold">
                          ${report.totalVentas} MXN
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <ShoppingCartIcon className="h-4 w-4 mr-1 text-green-500" />
                          <span>{report.ordenesFinalizadas} órdenes</span>
                        </div>
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1 text-blue-500" />
                          <span>
                            {Object.keys(report.ventasPorMesero).length} meseros
                          </span>
                        </div>
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1 text-yellow-500" />
                          <span>{report.facturasEmitidas} facturas</span>
                        </div>
                      </div>
                    </div>
                    {index < previousReports.length - 1 && (
                      <div className="border-b border-cafe-claro/50 mb-4"></div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Haga clic en un reporte para ver más detalles
              </p>
            </div>
          </div>
        )}

        {/*{activeTab === "waiters" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-cafe-oscuro mb-4 flex items-center">
              <UserIcon className="h-7 w-7 mr-2 text-cafe-medio" />
              Gestionar Meseros
            </h2>
            <div className="mb-6">
              <button
                onClick={handleAddWaiter}
                className="flex items-center px-6 py-3 bg-cafe-medio text-white rounded-lg hover:bg-cafe-oscuro transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cafe-intenso focus:ring-offset-2"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Agregar Mesero
              </button>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {waiters.map((waiter) => (
                <li
                  key={waiter.id}
                  className="flex items-center justify-between bg-cafe-claro/30 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <span className="flex items-center text-cafe-oscuro">
                    <UserIcon className="h-5 w-5 mr-3 text-cafe-medio" />
                    {waiter.name}
                  </span>
                  <button
                    onClick={() => handleDeleteWaiter(waiter.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-300"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}*/}

        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-cafe-oscuro flex items-center">
                <CakeIcon className="h-7 w-7 mr-2 text-cafe-medio" />
                Comidas y Bebidas Disponibles
              </h2>
              <button
                onClick={handleOpenNewProductModal}
                className="flex items-center px-6 py-3 bg-cafe-medio text-white rounded-lg hover:bg-cafe-oscuro transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cafe-intenso focus:ring-offset-2"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Agregar Producto
              </button>
            </div>
            <div className="h-full min-h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-cafe-medio scrollbar-track-cafe-claro">
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center justify-between bg-cafe-claro/30 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <span className="text-cafe-oscuro">{product.nombre}</span>
                    <span className="text-cafe-medio">
                      ${product.precio.toFixed(2)}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenEditProductModal(product)}
                        className="text-cafe-medio hover:text-cafe-oscuro transition-colors duration-300"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id)}>
                        <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-700 transition-colors duration-300" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Improved Report Details Modal */}
      {isReportModalOpen && selectedReport && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-cafe-oscuro">
                Reporte del {selectedReport.fecha}
              </h2>
              <button
                onClick={closeReportModal}
                className="text-cafe-medio hover:text-cafe-oscuro transition-colors"
              >
                <XMarkIcon className="h-8 w-8" />
              </button>
            </div>
            <div className="bg-cafe-claro/20 p-6 rounded-lg mb-6">
              <h3 className="text-2xl font-semibold text-cafe-oscuro mb-4 flex items-center">
                <SparklesIcon className="h-7 w-7 mr-2 text-cafe-medio" />
                Asistente Gemini
              </h3>
              <p className="text-black text-justify">
                {formatResumenGemini(selectedReport.resumenGemini)}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-cafe-claro/20 p-6 rounded-lg">
                  <h3 className="text-2xl font-semibold text-cafe-oscuro mb-4 flex items-center">
                    <ChartBarIcon className="h-7 w-7 mr-2 text-cafe-medio" />
                    Resumen de Ventas
                  </h3>
                  <div className="space-y-3">
                    <p className="flex items-center justify-between">
                      <span className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
                        Órdenes finalizadas:
                      </span>
                      <span className="font-semibold">
                        {selectedReport.ordenesFinalizadas}
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="flex items-center">
                        <XCircleIcon className="h-5 w-5 mr-2 text-red-500" />
                        Órdenes canceladas:
                      </span>
                      <span className="font-semibold">
                        {selectedReport.ordenesCanceladas}
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="flex items-center">
                        <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-600" />
                        Ventas totales:
                      </span>
                      <span className="font-semibold text-lg">
                        ${selectedReport.totalVentas} MXN
                      </span>
                    </p>
                  </div>
                </div>
                <div className="bg-cafe-claro/20 p-6 rounded-lg">
                  <h3 className="text-2xl font-semibold text-cafe-oscuro mb-4 flex items-center">
                    <CreditCardIcon className="h-7 w-7 mr-2 text-cafe-medio" />
                    Métodos de Pago
                  </h3>
                  <div className="space-y-3">
                    <p className="flex items-center justify-between">
                      <span className="flex items-center">
                        <BanknotesIcon className="h-5 w-5 mr-2 text-green-500" />
                        Efectivo:
                      </span>
                      <span className="font-semibold">
                        {selectedReport.metodosPago.efectivo}
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="flex items-center">
                        <CreditCardIcon className="h-5 w-5 mr-2 text-blue-500" />
                        Tarjeta:
                      </span>
                      <span className="font-semibold">
                        {selectedReport.metodosPago.tarjeta}
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="flex items-center">
                        <ReceiptRefundIcon className="h-5 w-5 mr-2 text-yellow-500" />
                        Facturas emitidas:
                      </span>
                      <span className="font-semibold">
                        {selectedReport.facturasEmitidas}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-cafe-claro/20 p-6 rounded-lg">
                  <h3 className="text-2xl font-semibold text-cafe-oscuro mb-4 flex items-center">
                    <UserIcon className="h-7 w-7 mr-2 text-cafe-medio" />
                    Ventas por Mesero
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-cafe-medio/20">
                          <th className="text-left py-2">Mesero</th>
                          <th className="text-left py-2">Órdenes</th>
                          <th className="text-left py-2">Ventas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(selectedReport.ventasPorMesero).map(
                          ([mesero, data]) => (
                            <tr
                              key={mesero}
                              className="border-b border-cafe-claro/20"
                            >
                              <td className="py-2">{mesero}</td>
                              <td className="py-2">{data.orders}</td>
                              <td className="py-2">${data.sales} MXN</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-cafe-claro/20 p-6 rounded-lg">
                  <h3 className="text-2xl font-semibold text-cafe-oscuro mb-4 flex items-center">
                    <ShoppingCartIcon className="h-7 w-7 mr-2 text-cafe-medio" />
                    Productos Más Vendidos
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-cafe-medio/20">
                          <th className="text-left py-2">Producto</th>
                          <th className="text-left py-2">Cantidad</th>
                          <th className="text-left py-2">Ventas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedReport.topProductos.map((product) => (
                          <tr
                            key={product.nombre}
                            className="border-b border-cafe-claro/20"
                          >
                            <td className="py-2">{product.nombre}</td>
                            <td className="py-2">{product.cantidad}</td>
                            <td className="py-2">${product.ventas} MXN</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <NuevoMeseroModal
        isOpen={isWaiterModalOpen}
        onClose={closeWaiterModal}
        onAddWaiter={addWaiterFromModal}
      />
      <NuevoProductoModal
        isOpen={isNewProductModalOpen}
        onClose={closeNewProductModal}
        onAddProduct={addProductFromModal}
      />
      <EditarProductoModal
        isOpen={isEditProductModalOpen}
        onClose={closeEditProductModal}
        onEditProduct={handleEditProduct}
        product={productToEdit}
      />
    </div>
  );
}
