import { useForm } from 'react-hook-form';
import { Button, Label, TextInput } from "flowbite-react";
import Navegacion from '../Common/Navegacion';
import { HiOutlineClipboard, HiHashtag } from "react-icons/hi";
import { API_URL } from '../../api/api';
import { useAuth } from '../../auth/useAuth';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';

const EditarFactura = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchFactura = async () => {
      try {
        const response = await fetch(`${API_URL}/facturacion/facturas/${id}/`, {
          headers: {
            'Authorization': `Bearer ${auth.getAccessToken()}`
          }
        });

        if (!response.ok) throw new Error('Error al obtener la factura');

        const data = await response.json();
        setValue('paciente', data.paciente);
        setValue('monto', data.monto);
        setValue('descuento', data.descuento);
        setLoading(false);
      } catch (error) {
        console.error(error);
        navigate('/facturacion/historial');
      }
    };

    fetchFactura();
  }, [id, auth, navigate, setValue]);

  const editarFactura = async (data) => {
    try {
      const response = await fetch(`${API_URL}/facturacion/facturas/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getAccessToken()}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al editar la factura');
      } else {
        navigate('/facturacion/historial');
      }
    } catch (error) {
      console.error('Error al editar la factura:', error);
    }
  };

  const onSubmit = async (data) => {
    await editarFactura(data);
  };

  if (loading) return <div className="text-center p-10">Cargando...</div>;

  return (
    <Navegacion>
      <div className="flex flex-col items-center sm:justify-center w-full h-full max-sm:mt-10">
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Editar Factura</h1>
        <form className="flex flex-col gap-4 dark:bg-gray-800 bg-white p-10 rounded-2xl w-[75%] max-w-lg" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="paciente">Nombre del Paciente:</Label>
            </div>
            <TextInput
              id="paciente"
              type="text"
              icon={HiOutlineClipboard}
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
              {...register("descuento")}
            />
          </div>

          <div className='flex gap-2 justify-evenly items-center col-span-2'>
            <Button type="submit" className="mt-4">Guardar Cambios</Button>
            <Button href="/factura/historial" className="mt-4" color="red">Cancelar</Button>
          </div>
        </form>
      </div>
    </Navegacion>
  );
};

export default EditarFactura;
