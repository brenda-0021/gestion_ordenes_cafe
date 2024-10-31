"use client";

import React, { useEffect, useState } from "react";
import NuevoMeseroModal from "../components/NuevoMeseroModal";
import NuevoProductoModal from "../components/NuevoProducctoModal";
import EditarProductoModal from "../components/EditarProductoModal";
import { db } from "../credenciales";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  UserIcon,
  CakeIcon,
  ClipboardDocumentListIcon,
  PencilSquareIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
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
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "productos");
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre,
          precio: doc.data().precio,
          tipo: doc.data().tipo,
        }));

        productsList.sort((a, b) => a.nombre.localeCompare(b.nombre));

        setProducts(productsList);
      } catch (error) {
        console.error("Error al obtener productos: ", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddWaiter = () => {
    setIsWaiterModalOpen(true);
  };

  const handleDeleteWaiter = (id) => {
    setWaiters(waiters.filter((waiter) => waiter.id !== id));
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
          <button
            onClick={() => setActiveTab("waiters")}
            className={`mr-4 mb-2 px-6 py-3 rounded-lg flex items-center transition-colors duration-300 ${
              activeTab === "waiters"
                ? "bg-cafe-oscuro text-white"
                : "bg-cafe-claro text-cafe-oscuro hover:bg-cafe-medio hover:text-white"
            }`}
          >
            <UserIcon className="h-5 w-5 mr-2" />
            Meseros
          </button>
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
            <h2 className="text-2xl font-semibold text-cafe-oscuro mb-4 flex items-center">
              <ChartBarIcon className="h-7 w-7 mr-2 text-cafe-medio" />
              Reportes
            </h2>
            <button className="mb-6 flex items-center px-6 py-3 bg-cafe-medio text-white rounded-lg hover:bg-cafe-oscuro transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cafe-intenso focus:ring-offset-2">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Generar reporte del día
            </button>
            <div className="bg-cafe-claro/30 p-6 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold text-cafe-oscuro mb-4 flex items-center">
                <ClipboardDocumentListIcon className="h-6 w-6 mr-2 text-cafe-medio" />
                Reportes Anteriores
              </h3>
              <ul className="space-y-3">
                {["22/05/2023", "21/05/2023"].map((date) => (
                  <li
                    key={date}
                    className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <span className="flex items-center text-cafe-oscuro">
                      <DocumentTextIcon className="h-5 w-5 mr-3 text-cafe-medio" />
                      Reporte {date}
                    </span>
                    <button className="text-cafe-medio hover:text-cafe-oscuro transition-colors duration-300">
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "waiters" && (
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
        )}

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
