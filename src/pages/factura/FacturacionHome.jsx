import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiPlusCircle,
  HiClipboardList,
  HiBan
} from 'react-icons/hi';
import Navegacion from '../Common/Navegacion';

const FacturacionHome = () => {
  const navigate = useNavigate();

  const options = [
    {
      icon: <HiPlusCircle className="text-4xl text-green-400" />,
      label: 'Crear Factura',
      bg: 'bg-gradient-to-r from-green-700 to-green-500',
      onClick: () => navigate('/factura/crear')
    },
    {
      icon: <HiClipboardList className="text-4xl text-cyan-400" />,
      label: 'Historial de Facturas',
      bg: 'bg-gradient-to-r from-cyan-700 to-cyan-500',
      onClick: () => navigate('/factura/historial')
    },
   
  ];

  return (
    <Navegacion>
      <div className="flex flex-col items-center justify-center min-h-screen p-6 dark:text-white">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-cyan-400">
          💼 Gestión de Facturación
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-3xl">
          {options.map((opt, index) => (
            <div
              key={index}
              onClick={opt.onClick}
              className={`cursor-pointer ${opt.bg} rounded-xl shadow-lg p-6 flex items-center justify-between hover:scale-105 hover:shadow-2xl transform transition-all duration-300`}
            >
              <div className="flex items-center gap-4">
                {opt.icon}
                <span className="text-lg font-semibold text-white">{opt.label}</span>
              </div>
              <span className="text-white text-2xl">→</span>
            </div>
          ))}
        </div>
      </div>
    </Navegacion>
  );
};

export default FacturacionHome;
