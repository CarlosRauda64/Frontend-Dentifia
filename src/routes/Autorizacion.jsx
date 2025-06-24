import React from 'react';
import { Button } from 'flowbite-react';

const Autorizacion = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-800 rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-red-500 mb-4">Acceso Denegado</h2>
      <p className="text-gray-200 mb-6 text-center">
        No tienes permiso para entrar a este sitio.
      </p>
      <Button color="failure" onClick={handleBack} >
        Volver al sitio anterior
      </Button>
    </div>
  );
}

export default Autorizacion