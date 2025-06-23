import { useForm } from 'react-hook-form'
import { Button, Label, TextInput } from "flowbite-react";
import Navegacion from '../Common/Navegacion';
import { HiOutlineClipboard, HiPencil, HiHashtag } from "react-icons/hi";
import { API_URL } from '../../api/api';
import { useAuth } from '../../auth/useAuth';
import { useNavigate } from 'react-router';

const FormCrearInsumo = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const crearInsumo = async (data) => {
        // El stock_actual ya no se envía, el backend lo inicializa en 0.
        const dataToSend = {
            ...data,
        };

        try {
            const response = await fetch(`${API_URL}/inventario/insumos/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error('Error al crear el insumo');
            } else {
                navigate('/inventario/insumos');
            }
        } catch (error) {
            console.error('Error al crear el insumo:', error);
        }
    }

    const onSubmit = async (data) => {
        await crearInsumo(data);
        reset();
    }

    return (
        <Navegacion>
            <div className="flex flex-col items-center sm:justify-center w-full h-full max-sm:mt-10">
                <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Crear Nuevo Insumo</h1>
                <form className="flex flex-col gap-4 dark:bg-gray-800 bg-white p-10 rounded-2xl w-[75%] max-w-lg" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="nombre">Nombre del Insumo:</Label>
                        </div>
                        <TextInput
                            id="nombre"
                            type="text"
                            icon={HiOutlineClipboard}
                            placeholder="Ej: Guantes de Nitrilo"
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
                            placeholder="Ej: Caja de 100 unidades"
                            {...register("descripcion", { required: "Este campo es obligatorio" })}
                        />
                        {errors.descripcion && <span className="font-medium text-red-500">{errors.descripcion.message}</span>}
                    </div>
                    

                    <div className='flex gap-2 justify-evenly items-center col-span-2'>
                        <Button type="submit" className="mt-4">Agregar</Button>
                        <Button href="/inventario/insumos" className="mt-4" color="red">Cancelar</Button>
                    </div>
                </form>
            </div>
        </Navegacion>
    )
}

export default FormCrearInsumo;