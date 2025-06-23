import { useForm } from 'react-hook-form';
import { Button, Label, TextInput } from "flowbite-react";
import Navegacion from '../Common/Navegacion';
import { HiOutlineClipboard, HiHashtag } from "react-icons/hi";
import { API_URL } from '../../api/api';
import { useAuth } from '../../auth/useAuth';
import { useNavigate } from 'react-router';

const CrearFactura = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const crearFactura = async (data) => {
    const dataToSend = {
      ...data
    };

    try {
      const response = await fetch(`${API_URL}/facturacion/facturas/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getAccessToken()}`
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Error al crear la factura');
      } else {
        navigate('/factura/historial');
      }
    } catch (error) {
      console.error('Error al crear la factura:', error);
    }
  };

  const onSubmit = async (data) => {
    await crearFactura(data);
    reset();
  };

  return (
    <Navegacion>
      <div className="flex flex-col items-center sm:justify-center w-full h-full max-sm:mt-10">
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Crear Nueva Factura</h1>
        <form className="flex flex-col gap-4 dark:bg-gray-800 bg-white p-10 rounded-2xl w-[75%] max-w-lg" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="paciente">Nombre del Paciente:</Label>
            </div>
            <TextInput
              id="paciente"
              type="text"
              icon={HiOutlineClipboard}
              placeholder="Ej: Juan Pérez"
              {...register("paciente", { required: "Este campo es obligatorio" })}
            />
            {errors.paciente && <span className="font-medium text-red-500">{errors.paciente.message}</span>}
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="monto">Monto de los Servicios:</Label>
            </div>
            <TextInput
              id="monto"
              type="number"
              icon={HiHashtag}
              placeholder="Ej: 120.50"
              {...register("monto", { required: "Este campo es obligatorio" })}
            />
            {errors.monto && <span className="font-medium text-red-500">{errors.monto.message}</span>}
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="descuento">Descuento (%):</Label>
            </div>
            <TextInput
              id="descuento"
              type="number"
              icon={HiHashtag}
              placeholder="Ej: 10"
              {...register("descuento")}
            />
          </div>

          <div className='flex gap-2 justify-evenly items-center col-span-2'>
            <Button type="submit" className="mt-4">Crear Factura</Button>
            <Button href="/factura/historial" className="mt-4" color="red">Cancelar</Button>
          </div>
        </form>
      </div>
    </Navegacion>
  );
};

export default CrearFactura;
