import { useState } from 'react';
import { Button, Label, TextInput } from "flowbite-react";
import Navegacion from '../Common/Navegacion';
import { useAuth } from '../../auth/useAuth';
import { API_URL } from '../../api/api';
import { useNavigate, useParams } from 'react-router';

const CancelarFactura = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState(null);

  const cancelarFactura = async () => {
    try {
      const response = await fetch(`${API_URL}/facturacion/facturas/${id}/cancelar/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getAccessToken()}`
        },
        body: JSON.stringify({ motivo })
      });

      if (!response.ok) throw new Error('No se pudo cancelar la factura.');

      navigate('/factura/historial');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Navegacion>
      <div className="flex flex-col items-center sm:justify-center w-full h-full max-sm:mt-10">
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Cancelar Factura</h1>
        <div className="dark:bg-gray-800 bg-white p-10 rounded-2xl w-[75%] max-w-lg">
          <Label htmlFor="motivo">Motivo de cancelación:</Label>
          <TextInput
            id="motivo"
            placeholder="Ej: Error en los datos"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
          {error && <span className="text-red-500 font-medium mt-2 block">{error}</span>}
          <div className='flex gap-2 justify-evenly mt-6'>
            <Button color="failure" onClick={cancelarFactura}>Confirmar Cancelación</Button>
            <Button href="/factura/historial" color="gray">Cancelar</Button>
          </div>
        </div>
      </div>
    </Navegacion>
  );
};

export default CancelarFactura;
