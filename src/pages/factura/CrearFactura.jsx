import { useForm, useFieldArray } from 'react-hook-form';
import { Button, Label, TextInput, Select } from "flowbite-react";
import Navegacion from '../Common/Navegacion';
import { HiOutlineClipboard, HiHashtag, HiCalendar, HiCreditCard, HiCheck } from "react-icons/hi";
import { API_URL } from '../../api/api';
import { useAuth } from '../../auth/useAuth';
import { useNavigate } from 'react-router';

const CrearFactura = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      idfactura: "",
      fecha_emision: "",
      metodo_pago: "efectivo",
      estado: "ACEPTADA",
      activo: true,
      detalles: [{ descripcion: "", precio_unitario: 0, cantidad: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detalles"
  });

  const onSubmit = async (data) => {
    // Calcular el monto total
    const monto_total = data.detalles.reduce((acc, item) => {
      return acc + (parseFloat(item.precio_unitario) * parseInt(item.cantidad));
    }, 0);

    const dataToSend = {
      ...data,
      monto_total,
    };

    console.log(dataToSend);
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
    const text = await response.text(); // 👈 Captura como texto para evitar error de parseo
    console.error("❌ Respuesta del backend:", text);
    throw new Error('Error al crear la factura');
  }

navigate('/factura/historial');

} catch (error) {
  console.error('❌ Error al crear la factura:', error);
  alert("No se pudo crear la factura. Revisa consola para más detalles.");
}

  };

  return (
    <Navegacion>
      <div className="flex flex-col items-center sm:justify-center w-full h-full max-sm:mt-10">
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Crear Factura</h1>
        <form
          className="flex flex-col gap-4 dark:bg-gray-800 bg-white p-10 rounded-2xl w-[90%] max-w-4xl"
          onSubmit={handleSubmit(onSubmit)}
        >

          <TextInput icon={HiHashtag} placeholder="ID de Factura" {...register("idfactura", { required: "Requerido" })} />
          <TextInput icon={HiCalendar} type="date" {...register("fecha_emision", { required: "Requerido" })} />

          {/* Método de Pago (Select) */}
          <div>
            <Label htmlFor="metodo_pago">Método de Pago</Label>
            <Select id="metodo_pago" {...register("metodo_pago", { required: true })}>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </Select>
          </div>

          {/* Estado (Select) */}
          <div>
            <Label htmlFor="estado">Estado</Label>
            <Select id="estado" {...register("estado", { required: true })}>
              <option value="ACEPTADA">Aceptada</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="CANCELADA">Cancelada</option>
            </Select>
          </div>

          {/* Detalles */}
          <div className="border-t border-gray-600 pt-4">
            <h2 className="text-xl font-semibold mb-2">Detalles</h2>
            {fields.map((detalle, index) => (
              <div key={detalle.id} className="grid grid-cols-3 gap-2 items-end mb-3">
                <TextInput placeholder="Descripción" {...register(`detalles.${index}.descripcion`, { required: "Requerido" })} />
                <TextInput type="number" placeholder="Precio Unitario" {...register(`detalles.${index}.precio_unitario`, { required: "Requerido" })} />
                <TextInput type="number" placeholder="Cantidad" {...register(`detalles.${index}.cantidad`, { required: "Requerido" })} />
                <Button color="red" onClick={() => remove(index)}>Eliminar</Button>
              </div>
            ))}
            <Button type="button" onClick={() => append({ descripcion: "", precio_unitario: 0, cantidad: 1 })}>
              Agregar Detalle
            </Button>
          </div>

          {/* Botones */}
          <div className='flex gap-2 justify-evenly items-center'>
            <Button type="submit" className="mt-4">Guardar Factura</Button>
            <Button href="/facturacion/facturas" className="mt-4" color="red">Cancelar</Button>
          </div>
        </form>
      </div>
    </Navegacion>
  );
};

export default CrearFactura;
