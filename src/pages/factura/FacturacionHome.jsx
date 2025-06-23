import React from 'react';
import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import {
  HiPlusCircle,
  HiClipboardList,
  HiPencil,
  HiBan,
} from 'react-icons/hi';
import Navegacion from '../Common/Navegacion';

const FacturacionHome = () => {
  const navigate = useNavigate();

  const buttonClasses = "transition transform hover:scale-105 hover:shadow-xl duration-300";

  return (
    <Navegacion>
      <div className="flex flex-col items-center justify-center h-full p-6 dark:text-white">
        <h1 className="text-3xl font-bold mb-8 text-center">Gestión de Facturación</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
          <Button
            color="blue"
            onClick={() => navigate('/factura/crear')}
            className={`${buttonClasses} flex items-center justify-center gap-2`}
          >
            <HiPlusCircle className="text-xl" />
            Crear Factura
          </Button>

          <Button
            color="blue"
            onClick={() => navigate('/factura/historial')}
            className={`${buttonClasses} flex items-center justify-center gap-2`}
          >
            <HiClipboardList className="text-xl" />
            Historial de Facturas
          </Button>

          <Button
            color="blue"
            onClick={() => navigate('/factura/editar')}
            className={`${buttonClasses} flex items-center justify-center gap-2`}
          >
            <HiPencil className="text-xl" />
            Editar Factura
          </Button>

          <Button
            color="blue"
            onClick={() => navigate('/factura/cancelar')}
            className={`${buttonClasses} flex items-center justify-center gap-2`}
          >
            <HiBan className="text-xl" />
            Cancelar Factura
          </Button>
        </div>
      </div>
    </Navegacion>
  );
};

export default FacturacionHome;
