import { useForm, Controller } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { Button, Label, TextInput, Select, Datepicker } from "flowbite-react";
import Navegacion from '../Common/Navegacion';
import {
    HiMail,
    HiUser,
    HiOutlineClipboard,
    HiLockClosed,
    HiHashtag,
    HiOutlineSwitchHorizontal,
    HiArchive,
} from "react-icons/hi";
import { API_URL } from '../../api/api';
import { useAuth } from '../../auth/useAuth';
import { useNavigate } from 'react-router';
import AuthContext from '../../auth/AuthContext';

const FormMovimiento = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [insumos, setInsumos] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();



    useEffect(() => {
        const fetchInsumos = async () => {
            const data = await cargarInsumos();
            setInsumos(data);
        };
        fetchInsumos();
    }, []);

    const cargarInsumos = async () => {
        try {
            const response = await fetch(`${API_URL}/inventario/insumos/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                },
            });
            if (!response.ok) {
                throw new Error('Error al cargar los insumos');
            }
            const insumos = await response.json();
            return insumos.map(insumo => ({
                value: insumo.id,
                label: insumo.nombre,
            }));

        } catch (error) {
            console.error('Error al cargar los insumos', error);
            return [];
        }
    }


    const insertarMovimiento = async (data) => {
        try {
            const response = await fetch(`${API_URL}/inventario/movimiento_stock/insertar/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Error al realizar el movimiento');
            } else {
                navigate('/inventario/movimientos_stock');
            }
        } catch (error) {
            console.error('Error al realizar el movimiento', error);
        }
    }

    const onSubmit = async (data) => {
        const usuario = auth.getUser();
        const payload = {
            ...data,
            usuario: parseInt(usuario?.id, 10),
            nombre_usuario: usuario?.nombre,
            rol_usuario: usuario?.rol,
            insumo: parseInt(data.insumo),  
            cantidad: parseInt(data.cantidad)  
        };

        console.log("Payload final:", payload);
        await insertarMovimiento(payload);
        reset();
    };

    return (
        <Navegacion>
            <div className="flex flex-col items-center sm:justify-center w-full h-full max-sm:mt-10">
                <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Realizar movimiento en stock</h1>
                <form className="flex flex-col gap-4 dark:bg-gray-800 bg-white p-10 rounded-2xl w-[75%] max-w-md lg:grid lg:grid-cols-2 lg:max-w-4xl" onSubmit={handleSubmit(onSubmit)}>

                    {/* Tipo Input */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="tipo">Seleccionar el tipo de movimiento</Label>
                        </div>
                        <Select id="tipo" name="tipo" icon={HiOutlineSwitchHorizontal}
                            {...register("tipo", {
                                required: {
                                    value: true,
                                    message: "Este campo es obligatorio"
                                },
                            })}
                        >
                            <option value="" disabled selected>Seleccione un tipo de movimiento</option>
                            <option>entrada</option>
                            <option>salida</option>
                        </Select>
                        {errors.rol && <span className="font-medium text-red-500">{errors.rol.message}</span>}
                    </div>
                    {/* Fecha Input */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label>Fecha del movimiento (automática):</Label>
                        </div>
                        <Datepicker
                            id="fecha"
                            name="fecha"
                            disabled
                        />
                    </div>
                    {/*Cantidad Input */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="cantidad">Cantidad:</Label>
                        </div>
                        <TextInput
                            id="cantidad"
                            name="cantidad"
                            type="number"
                            icon={HiHashtag}
                            placeholder="Ingrese la cantidad"
                            required={true}
                            {...register("cantidad", {
                                required: {
                                    value: true,
                                    message: "Este campo es obligatorio"
                                },
                                min: {
                                    value: 1,
                                    message: "La cantidad debe ser mayor a 0"
                                }
                            })}
                        />
                        {errors.cantidad && <span className="font-medium text-red-500">{errors.cantidad.message}</span>}
                    </div>
                    {/* Insumo Input */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="insumo">Insumo:</Label>
                        </div>
                        <Select
                            id="insumo"
                            name="insumo"
                            icon={HiArchive}
                            {...register("insumo", {
                                required: {
                                    value: true,
                                    message: "Este campo es obligatorio",
                                },
                            })}
                        >
                            <option value="" disabled>Seleccione un insumo</option>
                            {insumos.map((insumo) => (

                                <option key={insumo.value} value={insumo.value}>
                                    {insumo.label}
                                </option>
                            ))}
                        </Select>

                        {errors.insumo && <span className="font-medium text-red-500">{errors.insumo.message}</span>}
                    </div>
                    {/* Botones en el formulario */}
                    <div className='flex gap-2 justify-evenly items-center col-span-2'>
                        <Button type="submit" className="mt-4">Agregar</Button>
                        <Button href="/inventario/movimientos_stock" className="mt-4" color="red">Cancelar</Button>
                    </div>
                </form>
            </div>
        </Navegacion>
    )
}

export default FormMovimiento