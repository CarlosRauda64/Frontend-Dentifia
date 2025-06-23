import React from "react";
import { FaBox, FaWarehouse } from "react-icons/fa";
import Navegacion from "../Common/Navegacion";
import { Label, TextInput } from "flowbite-react";



const MenuInventario = () => {
    const irAGestionMovimientos = () => {
        window.location.href = "/inventario/movimientos_stock";
    };
    const irAGestionInsumos = () => {
        window.location.href = "/inventario/insumos";
    };
  return (
    <Navegacion>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
  <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Menú de Inventario</h1>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    {/* Botón de Gestión de Insumos */}
    <button onClick={irAGestionInsumos} className="w-48 h-48 flex flex-col items-center justify-center bg-white dark:bg-gray-800 shadow-lg rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-all">
      <FaBox className="text-blue-600 dark:text-blue-400 text-6xl mb-4" />
      <span className="text-lg font-semibold text-gray-800 dark:text-white">
        Gestión de Insumos
      </span>
    </button>

    {/* Botón de Gestión de Stock */}
    <button
      onClick={irAGestionMovimientos}
      className="w-48 h-48 flex flex-col items-center justify-center bg-white dark:bg-gray-800 shadow-lg rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition-all"
    >
      <FaWarehouse className="text-green-600 dark:text-green-400 text-6xl mb-4" />
      <span className="text-lg font-semibold text-gray-800 dark:text-white">
        Gestión del Stock
      </span>
    </button>
  </div>
</div>
    </Navegacion>
    
  );
};

export default MenuInventario;
