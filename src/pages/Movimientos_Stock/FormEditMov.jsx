import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { Button, Label, TextInput, Select } from "flowbite-react";
import Navegacion from '../Common/Navegacion';
import { HiHashtag, HiOutlineSwitchHorizontal } from "react-icons/hi";
import { API_URL } from '../../api/api';
import { useAuth } from '../../auth/useAuth';
import { useNavigate, useParams } from 'react-router';

const FormEditMovimiento = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const { id } = useParams(); // <-- obtenemos el id desde la URL
    const [errorResponse, setErrorResponse] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    // Cargar movimiento existente
    useEffect(() => {
        const fetchMovimiento = async () => {
            try {
                const response = await fetch(`${API_URL}/inventario/movimientos_stock/${id}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.getAccessToken()}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    reset({
                        tipo: data.tipo,
                        cantidad: data.cantidad,
                        insumo: data.insumo
                    });
                } else {
                    console.error("Error al obtener datos del movimiento.");
                }
            } catch (error) {
                console.error("Error al cargar movimiento:", error);
            }
        };
        fetchMovimiento();
    }, [id, reset, auth]);

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`${API_URL}/inventario/movimiento_stock/actualizar/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorResponse(errorData.error || 'Error al actualizar el movimiento');
                throw new Error(errorData.error || 'Error al actualizar el movimiento');
            } else {
                navigate('/inventario/movimientos_stock');
            }
        } catch (error) {
            console.error('Error al actualizar el movimiento:', error.message);
        }
    };

    return (
        <Navegacion>
            <div className="flex flex-col items-center sm:justify-center w-full h-full max-sm:mt-10">
                <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Editar movimiento en stock</h1>
                <form className="flex flex-col gap-4 dark:bg-gray-800 bg-white p-10 rounded-2xl w-[75%] max-w-md lg:grid lg:grid-cols-2 lg:max-w-4xl" onSubmit={handleSubmit(onSubmit)}>

                    {/* Tipo Input */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="tipo">Tipo de movimiento</Label>
                        </div>
                        <Select id="tipo" icon={HiOutlineSwitchHorizontal}
                            {...register("tipo", {
                                required: "Este campo es obligatorio"
                            })}
                        >
                            <option value="">Seleccione un tipo</option>
                            <option value="entrada">Entrada</option>
                            <option value="salida">Salida</option>
                        </Select>
                        {errors.tipo && <span className="text-red-500">{errors.tipo.message}</span>}
                    </div>

                    {/* Cantidad Input */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="cantidad">Cantidad</Label>
                        </div>
                        <TextInput
                            id="cantidad"
                            type="number"
                            icon={HiHashtag}
                            placeholder="Ingrese la cantidad"
                            {...register("cantidad", {
                                required: "Este campo es obligatorio",
                                min: { value: 1, message: "Debe ser mayor que 0" }
                            })}
                        />
                        {errors.cantidad && <span className="text-red-500">{errors.cantidad.message}</span>}
                    </div>

                    {/* Botones */}
                    {errorResponse && <div className="col-span-2 text-center font-medium text-red-500 bg-red-100 p-2 rounded-lg">{errorResponse}</div>}
                    <div className='flex gap-2 justify-evenly items-center col-span-2'>
                        <Button type="submit" className="mt-4">Actualizar</Button>
                        <Button href="/inventario/movimientos_stock" className="mt-4" color="red">Cancelar</Button>
                    </div>
                </form>
            </div>
        </Navegacion>
    );
};

export default FormEditMovimiento;
