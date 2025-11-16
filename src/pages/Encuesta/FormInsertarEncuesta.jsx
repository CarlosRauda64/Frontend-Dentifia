import { useForm, Controller } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { Button, Label, TextInput, Select, Datepicker, Textarea } from "flowbite-react";
import Navegacion from '../Common/Navegacion';
import {
    HiMail,
    HiUser,
    HiOutlineClipboard,
    HiLockClosed,
    HiHashtag,
    HiOutlineSwitchHorizontal,
    HiArchive,
    HiOutlineEmojiSad,HiOutlineEmojiHappy,HiOutlineHeart
} from "react-icons/hi";
import { API_URL } from '../../api/api';
import { useAuth } from '../../auth/useAuth';
import { useNavigate } from 'react-router';
import AuthContext from '../../auth/AuthContext';

const FormEncuesta = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [insumos, setInsumos] = useState([]);
    const [errorResponse, setErrorResponse] = useState("");

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm();


    const insertarEncuesta = async (data) => {
        try {
            const response = await fetch(`${API_URL}/encuestas/insertar_encuesta/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorResponse(errorData.error || 'Error al registrar la encuesta');
                throw new Error(errorData.error || 'Error al registrar la encuesta');
            } else {
                navigate('/encuestas');
            }
        } catch (error) {
            console.error('Error al registrar la encuesta', error.message);
        }
    }

    const onSubmit = async (data) => {
       
        const payload = {
            ...data,
            
            observaciones: data.observaciones,
            nivel_satisfaccion: parseInt(data.nivel_satisfaccion)  
        };

        console.log("Payload final:", payload);
        await insertarEncuesta(payload);
        reset();
    };

    return (
        <Navegacion>
            <div className="flex flex-col items-center sm:justify-center w-full h-full max-sm:mt-10">
                <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Encuesta de Satisfacción</h1>
                <form className="flex flex-col gap-4 dark:bg-gray-800 bg-white p-10 rounded-2xl w-[75%] max-w-md lg:grid lg:grid-cols-1 lg:max-w-4xl" onSubmit={handleSubmit(onSubmit)}>
                    
                    {/* Nivel de Satisfacción Input */}
                    <div className="max-w-md w-full">
                        <div className="mb-2 block">
                            <Label htmlFor="nivel_satisfaccion">Nivel de Satisfacción</Label>
                        </div>
                        <div className="flex flex-col gap-2">
                            <input
                                type="range"
                                id="nivel_satisfaccion"
                                min="1"
                                max="3"
                                step="1"
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                {...register("nivel_satisfaccion", {
                                    required: {
                                        value: true,
                                        message: "Este campo es obligatorio"
                                    },
                                })}
                            />
                            <div className="flex justify-between px-2">
                                <span><HiOutlineEmojiSad size={20} className="mx-auto text-red-500"/></span>
                                <span><HiOutlineEmojiHappy size={20} className="mx-auto text-green-500"/></span>
                                <span><HiOutlineHeart size={20} className="mx-auto text-blue-500"/></span>
                            </div>
                        </div>
                        {errors.nivel_satisfaccion && <span className="font-medium text-red-500">{errors.nivel_satisfaccion.message}</span>}
                    </div>

                    {/* Observaciones Input (max 128 chars + contador) */}
                    <div className="max-w-md w-full">
                        <div className="mb-2 block">
                            <Label htmlFor="observaciones">Observaciones</Label>
                        </div>
                        <Controller
                            name="observaciones"
                            control={control}
                            defaultValue={''}
                            render={({ field }) => (
                                <>
                                    <Textarea
                                        id="observaciones"
                                        placeholder="Ingrese sus observaciones"
                                        value={field.value}
                                        onChange={(e) => {
                                            const v = e.target.value
                                            if (v.length <= 128) {
                                                field.onChange(v)
                                            }
                                        }}
                                    />
                                    <div className="text-xs text-gray-500 mt-1">{(field.value || '').length}/128</div>
                                </>
                            )}
                            rules={{ required: { value: true, message: 'Este campo es obligatorio' } }}
                        />
                        {errors.observaciones && <span className="font-medium text-red-500">{errors.observaciones.message}</span>}
                    </div>

                    {/* Submit + Cancel Buttons */}
                    <div className="flex justify-end gap-3 mt-4">
                        <Button type="button" color="gray" onClick={() => navigate('/encuestas')}>
                            Volver a la tabla
                        </Button>
                        <Button type="submit" color="blue">
                            Enviar Encuesta
                        </Button>
                    </div>
                </form>
            </div>
        </Navegacion>
    )
}

export default FormEncuesta