import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Label,
  TextInput,
  Button,
  Select,
  Card,
  Spinner,
  Alert,
} from "flowbite-react";
import { useAuth } from "../../auth/useAuth";
import { API_URL } from "../../api/api";
import Navegacion from "../Common/Navegacion";

const EditarFactura = () => {
  const { id } = useParams();
  const { register, handleSubmit, control, setValue } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "detalles",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const fetchFactura = async () => {
      try {
        const response = await fetch(`${API_URL}/facturacion/facturas/${id}/`, {
          headers: { Authorization: `Bearer ${auth.getAccessToken()}` },
        });

        if (!response.ok) throw new Error("No se pudo cargar la factura");

        const data = await response.json();

        setValue("fecha_emision", data.fecha_emision);
        setValue("metodo_pago", data.metodo_pago);
        setValue("estado", data.estado);
        setValue("detalles", data.detalles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFactura();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      if (!data.detalles || data.detalles.length === 0) {
      throw new Error("Debe agregar al menos un detalle a la factura.");
    }
      const monto_total = data.detalles.reduce((total, item) => {
        const precio = parseFloat(item.precio_unitario) || 0;
        const cantidad = parseInt(item.cantidad) || 0;
        return total + precio * cantidad;
      }, 0);

      const facturaPayload = {
        ...data,
        idfactura: id, 
        monto_total,
      };

      console.log("Datos enviados:", facturaPayload);

      const response = await fetch(`${API_URL}/facturacion/facturas/${id}/`, {
        method: "PUT",
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.getAccessToken()}`
      },
        body: JSON.stringify(facturaPayload),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.detail || "No se pudo actualizar la factura");

      navigate("/factura/historial");
    } catch (err) {
      console.log("Error al actualizar la factura:", err);
      setError(err.message);
    }
  };

  if (loading) return <Spinner size="xl" className="mx-auto mt-10" />;

  return (
    <Navegacion>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 dark:text-white text-gray-800 text-center">
          Editar Factura #{id}
        </h1>

        {error && (
          <Alert color="failure" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="fecha_emision" value="Fecha de Emisión" />
            <TextInput type="date" {...register("fecha_emision")} required />
          </div>

          <div>
            <Label htmlFor="metodo_pago" value="Método de Pago" />
            <Select {...register("metodo_pago")} required>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="estado" value="Estado" />
            <Select {...register("estado")} required>
              <option value="ACEPTADA">Aceptada</option>
              <option value="PENDIENTE">Pendiente</option>
            </Select>
          </div>

          <div>
            <h2 className="font-semibold mb-2 dark:text-white text-gray-800">Detalles</h2>
            {fields.map((item, index) => (
              <Card key={item.id} className="mb-3 dark:bg-gray-800  text-white">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <TextInput
                    placeholder="Descripción"
                    {...register(`detalles.${index}.descripcion`)}
                  />
                  <TextInput
                    placeholder="Precio Unitario"
                    type="number"
                    step="0.01"
                    {...register(`detalles.${index}.precio_unitario`)}
                  />
                  <TextInput
                    placeholder="Cantidad"
                    type="number"
                    {...register(`detalles.${index}.cantidad`)}
                  />
                </div>
                <div className="text-right mt-2">
                  <Button color="red" size="xs" onClick={() => remove(index)}>
                    Eliminar
                  </Button>
                </div>
              </Card>
            ))}
            <Button
              type="button"
              color="blue"
              onClick={() =>
                append({ descripcion: "", precio_unitario: 0, cantidad: 1 })
              }
            >
              Agregar Detalle
            </Button>
          </div>

          <div className="text-center mt-6">
            <Button type="submit" color="green">
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </Navegacion>
  );
};

export default EditarFactura;
