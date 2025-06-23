import { useForm } from 'react-hook-form'
import { Button, Label, TextInput } from "flowbite-react";
import Navegacion from '../Common/Navegacion';
import { HiOutlineClipboard, HiPencil, HiHashtag } from "react-icons/hi";
import { API_URL } from '../../api/api';
import { useAuth } from '../../auth/useAuth';
import { useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';

const FormEditarInsumo = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        const fetchInsumo = async () => {
            try {
                const response = await fetch(`${API_URL}/inventario/insumos/${id}/`, {
                    headers: { 'Authorization': `Bearer ${auth.getAccessToken()}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    reset(data);
                } else {
                    console.error("Error al obtener datos del insumo.");
                }
            } catch (error) {
                console.error("Error al cargar insumo:", error);
            }
        };
        fetchInsumo();
    }, [id, reset, auth]);

    const editarInsumo = async (data) => {
        // Ya no enviamos stock_actual, es de solo lectura.
        const dataToSend = {
            nombre: data.nombre,
            descripcion: data.descripcion,
        };

        try {
            const response = await fetch(`${API_URL}/inventario/insumos/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error('Error al editar el insumo');
            } else {
                navigate('/inventario/insumos');
            }
        } catch (error) {
            console.error('Error al editar el insumo:', error);
        }
    }

    const onSubmit = async (data) => {
        await editarInsumo(data);
        reset();
    }

    return (
        <Navegacion>
            <div className="flex flex-col items-center sm:justify-center w-full h-full max-sm:mt-10">
                <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Editar Insumo</h1>
                <form className="flex flex-col gap-4 dark:bg-gray-800 bg-white p-10 rounded-2xl w-[75%] max-w-lg" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="nombre">Nombre del Insumo:</Label>
                        </div>
                        <TextInput
                            id="nombre"
                            type="text"
                            icon={HiOutlineClipboard}
                            {...register("nombre", { required: "Este campo es obligatorio" })}
                        />
                        {errors.nombre && <span className="font-medium text-red-500">{errors.nombre.message}</span>}
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="descripcion">Descripción:</Label>
                        </div>
                        <TextInput
                            id="descripcion"
                            type="text"
                            icon={HiPencil}
                            {...register("descripcion", { required: "Este campo es obligatorio" })}
                        />
                        {errors.descripcion && <span className="font-medium text-red-500">{errors.descripcion.message}</span>}
                    </div>
                    
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="stock_actual">Stock Actual:</Label>
                        </div>
                        <TextInput
                            id="stock_actual"
                            type="number"
                            icon={HiHashtag}
                            {...register("stock_actual", {
                                required: "Este campo es obligatorio",
                                min: { value: 0, message: "El stock no puede ser negativo" }
                            })}
                        />
                        {errors.stock_actual && <span className="font-medium text-red-500">{errors.stock_actual.message}</span>}
                    </div>

                    <div className='flex gap-2 justify-evenly items-center col-span-2'>
                        <Button type="submit" className="mt-4">Actualizar</Button>
                        <Button href="/inventario/insumos" className="mt-4" color="red">Cancelar</Button>
                    </div>
                </form>
            </div>
        </Navegacion>
    )
}

export default FormEditarInsumo;