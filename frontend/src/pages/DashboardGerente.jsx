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

  const handleEditProduct = async (productData) => {
    if (
      !productData ||
      !productData.id ||
      !productData.nombre ||
      isNaN(productData.precio)
    ) {
      console.error("ID, nombre o precio inválidos");
      return;
    }

    try {
      const productRef = doc(db, "productos", productData.id);
      await updateDoc(productRef, {
        nombre: productData.nombre,
        precio: parseFloat(productData.precio) || 0,
      });

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productData.id
            ? {
                ...product,
                nombre: productData.nombre,
                precio: parseFloat(productData.precio) || 0,
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
    if (!productData.nombre || isNaN(productData.precio)) {
      console.error("Nombre o precio inválidos");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "productos"), {
        nombre: productData.nombre,
        precio: parseFloat(productData.precio) || 0,
      });

      setProducts((prevProducts) => [
        ...prevProducts,
        {
          id: docRef.id,
          nombre: productData.nombre,
          precio: parseFloat(productData.precio) || 0,
        },
      ]);
      console.log("Producto agregado:", {
        nombre: productData.nombre,
        precio: parseFloat(productData.precio) || 0,
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
      className={`min-h-screen bg-cafe-suave p-4 md:p-8 ${
        isSideMenuVisible ? "sm:ml-16 lg:ml-64" : ""
      }`}
    >
      <div className="mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-cafe-oscuro mb-6">
          Panel del Gerente
        </h1>

        <div className="flex flex-wrap mb-6">
          <button
            onClick={() => setActiveTab("reports")}
            className={`mr-2 mb-2 px-4 py-2 rounded-md flex items-center ${
              activeTab === "reports"
                ? "bg-cafe-oscuro text-white"
                : "bg-cafe-claro text-cafe-oscuro"
            }`}
          >
            <PencilSquareIcon className="h-5 w-5 mr-2" />
            Reportes
          </button>
          <button
            onClick={() => setActiveTab("waiters")}
            className={`mr-2 mb-2 px-4 py-2 rounded-md flex items-center ${
              activeTab === "waiters"
                ? "bg-cafe-oscuro text-white"
                : "bg-cafe-claro text-cafe-oscuro"
            }`}
          >
            <UserIcon className="h-5 w-5 mr-2" />
            Meseros
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`mr-2 mb-2 px-4 py-2 rounded-md flex items-center ${
              activeTab === "products"
                ? "bg-cafe-oscuro text-white"
                : "bg-cafe-claro text-cafe-oscuro"
            }`}
          >
            <CakeIcon className="h-5 w-5 mr-2" />
            Productos
          </button>
        </div>

        {activeTab === "reports" && (
          <div>
            <h2 className="text-2xl font-semibold text-cafe-oscuro mb-4">
              Reportes
            </h2>
            <button className="mb-4 flex items-center px-4 py-2 bg-cafe-medio text-white rounded-md hover:bg-cafe-oscuro focus:outline-none focus:ring-2 focus:ring-cafe-intenso">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Generar reporte del día
            </button>
            <div className="bg-cafe-claro p-4 rounded-md">
              <h3 className="text-xl font-semibold text-cafe-oscuro mb-2">
                Reportes Anteriores
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-cafe-medio" />
                  <span>Reporte 22/05/2023</span>
                </li>
                <li className="flex items-center">
                  <ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-cafe-medio" />
                  <span>Reporte 21/05/2023</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "waiters" && (
          <div>
            <h2 className="text-2xl font-semibold text-cafe-oscuro mb-4">
              Gestionar Meseros
            </h2>
            <div className="flex mb-4">
              <button
                onClick={handleAddWaiter}
                className="flex items-center px-4 py-2 bg-cafe-medio text-white rounded-md hover:bg-cafe-oscuro focus:outline-none focus:ring-2 focus:ring-cafe-intenso"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Agregar Mesero
              </button>
            </div>
            <ul className="space-y-2">
              {waiters.map((waiter) => (
                <li
                  key={waiter.id}
                  className="flex items-center justify-between bg-cafe-claro p-2 rounded-md"
                >
                  <span className="flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-cafe-medio" />
                    {waiter.name}
                  </span>
                  <button
                    onClick={() => handleDeleteWaiter(waiter.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <h2 className="text-2xl font-semibold text-cafe-oscuro mb-4">
              Comidas y Bebidas Disponibles
            </h2>
            <div className="flex justify-between">
              <div></div>
              <button
                onClick={handleOpenNewProductModal}
                className="flex items-center px-4 py-2 bg-cafe-medio text-white rounded-md hover:bg-cafe-oscuro focus:outline-none focus:ring-2 focus:ring-cafe-intenso ml-auto"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Agregar Producto
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between bg-cafe-claro p-4 rounded-md"
                >
                  <span className="flex items-center text-cafe-oscuro">
                    <CakeIcon className="h-5 w-5 mr-2 text-cafe-oscuro" />
                    {product.nombre} -{" "}
                    <span className="text-red-500">
                      $
                      {product.precio !== undefined
                        ? product.precio.toFixed(2)
                        : "N/A"}
                    </span>
                  </span>
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        setProductToEdit({ ...product });
                        setIsEditProductModalOpen(true);
                      }}
                      className="text-cafe-medio hover:text-cafe-oscuro mr-2"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
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
        product={productToEdit}
        onEditProduct={handleEditProduct}
      />
    </div>
  );
}
