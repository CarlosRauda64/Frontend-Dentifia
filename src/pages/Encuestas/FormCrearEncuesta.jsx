import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { Button, Label, TextInput, Select } from "flowbite-react";
import Navegacion from '../Common/Navegacion';
import { HiClipboardCheck, HiStar, HiX } from "react-icons/hi";
import { API_URL } from '../../api/api';
import { useAuth } from '../../auth/useAuth';
import { useNavigate } from 'react-router';

const FormCrearEncuesta = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            nivel_satisfaccion: 0,
            observaciones: '',
            preguntas_respuestas: {}
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "preguntas_respuestas_array"
    });

    const crearEncuesta = async (data) => {
        // Convertir array de preguntas/respuestas a objeto JSON
        const preguntasRespuestas = {};
        if (data.preguntas_respuestas_array && Array.isArray(data.preguntas_respuestas_array)) {
            data.preguntas_respuestas_array.forEach(item => {
                if (item.pregunta && item.respuesta) {
                    preguntasRespuestas[item.pregunta] = item.respuesta;
                }
            });
        }

        const dataToSend = {
            nivel_satisfaccion: parseInt(data.nivel_satisfaccion) || 0,
            observaciones: data.observaciones || '',
            preguntas_respuestas: preguntasRespuestas
        };

        try {
            const response = await fetch(`${API_URL}/encuestas/insertar_encuesta/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear la encuesta');
            } else {
                navigate('/encuestas');
            }
        } catch (error) {
            console.error('Error al crear la encuesta:', error);
            alert(error.message || 'Error al crear la encuesta. Por favor, intente nuevamente.');
        }
    };

    const onSubmit = async (data) => {
        await crearEncuesta(data);
        reset();
    };

    return (
        <Navegacion>
            <div className="flex flex-col items-center sm:justify-center w-full h-full max-sm:mt-10">
                <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Crear Nueva Encuesta</h1>
                <form className="flex flex-col gap-4 dark:bg-gray-800 bg-white p-10 rounded-2xl w-[75%] max-w-2xl" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="nivel_satisfaccion">Nivel de Satisfacción (1-5):</Label>
                        </div>
                        <Select
                            id="nivel_satisfaccion"
                            {...register("nivel_satisfaccion", { 
                                required: "Este campo es obligatorio",
                                min: { value: 1, message: "El valor mínimo es 1" },
                                max: { value: 5, message: "El valor máximo es 5" }
                            })}
                        >
                            <option value="0">Seleccionar...</option>
                            <option value="1">1 - Muy Insatisfecho</option>
                            <option value="2">2 - Insatisfecho</option>
                            <option value="3">3 - Neutral</option>
                            <option value="4">4 - Satisfecho</option>
                            <option value="5">5 - Muy Satisfecho</option>
                        </Select>
                        {errors.nivel_satisfaccion && <span className="font-medium text-red-500">{errors.nivel_satisfaccion.message}</span>}
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="observaciones">Observaciones:</Label>
                        </div>
                        <TextInput
                            id="observaciones"
                            type="text"
                            icon={HiClipboardCheck}
                            placeholder="Observaciones generales..."
                            {...register("observaciones", { required: "Este campo es obligatorio" })}
                        />
                        {errors.observaciones && <span className="font-medium text-red-500">{errors.observaciones.message}</span>}
                    </div>

                    <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                        <div className="flex items-center justify-between mb-4">
                            <Label>Preguntas y Respuestas (Opcional)</Label>
                            <Button 
                                type="button" 
                                size="sm"
                                onClick={() => append({ pregunta: '', respuesta: '' })}
                            >
                                Agregar Pregunta
                            </Button>
                        </div>
                        
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-2 gap-2 items-end mb-3">
                                <div>
                                    <Label htmlFor={`pregunta-${index}`}>Pregunta</Label>
                                    <TextInput
                                        placeholder="Ej: ¿Cómo calificaría el servicio?"
                                        {...register(`preguntas_respuestas_array.${index}.pregunta`)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`respuesta-${index}`}>Respuesta</Label>
                                    <div className="flex gap-2">
                                        <TextInput
                                            placeholder="Respuesta..."
                                            {...register(`preguntas_respuestas_array.${index}.respuesta`)}
                                        />
                                        <Button 
                                            type="button" 
                                            color="red" 
                                            size="sm"
                                            onClick={() => remove(index)}
                                        >
                                            <HiX className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='flex gap-2 justify-evenly items-center col-span-2'>
                        <Button type="submit" className="mt-4">Guardar Encuesta</Button>
                        <Button href="/encuestas" className="mt-4" color="red">Cancelar</Button>
                    </div>
                </form>
            </div>
        </Navegacion>
    )
}

export default FormCrearEncuesta;

