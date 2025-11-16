import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Button, Label, TextInput, Alert, Radio } from "flowbite-react";
import { HiClipboardCheck, HiCheckCircle } from "react-icons/hi";
import { API_URL } from '../../api/api';

// Preguntas predefinidas hardcodeadas
const PREGUNTAS_PREDEFINIDAS = [
    {
        id: 'atencion_doctor',
        pregunta: '¿Cómo calificaría la atención del doctor?',
        tipo: 'radio',
        opciones: ['Excelente', 'Muy Buena', 'Buena', 'Regular', 'Mala']
    },
    {
        id: 'limpieza_instalaciones',
        pregunta: '¿Cómo calificaría la limpieza de las instalaciones?',
        tipo: 'radio',
        opciones: ['Excelente', 'Muy Buena', 'Buena', 'Regular', 'Mala']
    },
    {
        id: 'recomendaria_clinica',
        pregunta: '¿Recomendaría nuestra clínica a otras personas?',
        tipo: 'radio',
        opciones: ['Sí', 'No', 'No estoy seguro']
    },
    {
        id: 'tiempo_espera',
        pregunta: '¿Cómo calificaría el tiempo de espera?',
        tipo: 'radio',
        opciones: ['Excelente', 'Muy Bueno', 'Bueno', 'Regular', 'Malo']
    }
];

const EncuestaPublica = () => {
    const [enviado, setEnviado] = useState(false);
    const [error, setError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            observaciones: '',
        }
    });

    const onSubmit = async (data) => {
        setError(null);
        
        // Construir objeto de preguntas/respuestas
        const preguntasRespuestas = {};
        let respuestasCompletas = true;
        
        PREGUNTAS_PREDEFINIDAS.forEach(pregunta => {
            const respuesta = data[`pregunta_${pregunta.id}`];
            if (respuesta) {
                preguntasRespuestas[pregunta.pregunta] = respuesta;
            } else {
                respuestasCompletas = false;
            }
        });

        // Validar que todas las preguntas tengan respuesta
        if (!respuestasCompletas) {
            setError('Por favor responda todas las preguntas');
            return;
        }

        // El nivel_satisfaccion se calcula automáticamente en el backend
        // basado en el promedio ponderado de las respuestas
        const dataToSend = {
            observaciones: data.observaciones ? data.observaciones.trim() : '',
            preguntas_respuestas: preguntasRespuestas
        };

        try {
            const response = await fetch(`${API_URL}/encuestas/insertar_encuesta/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const responseData = await response.json();

            if (!response.ok) {
                // Manejar errores del backend
                let errorMessage = 'Error al enviar la encuesta';
                if (responseData.error) {
                    errorMessage = responseData.error;
                } else if (responseData.preguntas_respuestas) {
                    errorMessage = Array.isArray(responseData.preguntas_respuestas) 
                        ? responseData.preguntas_respuestas[0] 
                        : responseData.preguntas_respuestas;
                } else if (responseData.observaciones) {
                    errorMessage = Array.isArray(responseData.observaciones) 
                        ? responseData.observaciones[0] 
                        : responseData.observaciones;
                } else if (typeof responseData === 'object') {
                    // Mostrar el primer error encontrado
                    const firstError = Object.values(responseData)[0];
                    errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
                }
                throw new Error(errorMessage);
            }

            setEnviado(true);
            reset();
        } catch (error) {
            console.error('Error al enviar la encuesta:', error);
            setError(error.message || 'Error al enviar la encuesta. Por favor, intente nuevamente.');
        }
    };

    if (enviado) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                    <HiCheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                    <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                        ¡Gracias por su opinión!
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                        Su encuesta de satisfacción ha sido enviada exitosamente. 
                        Sus comentarios son muy importantes para nosotros.
                    </p>
                    <Button 
                        onClick={() => setEnviado(false)}
                        color="blue"
                    >
                        Enviar otra encuesta
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header simple */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        DentiFIA
                    </h1>
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Encuesta de Satisfacción
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Su opinión es muy importante para nosotros. Por favor, comparta su experiencia.
                    </p>
                </div>

                {/* Formulario */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    {error && (
                        <Alert color="failure" className="mb-6">
                            <span className="font-medium">Error: </span>{error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Observaciones */}
                        <div>
                            <Label htmlFor="observaciones" className="text-lg">
                                Observaciones o Comentarios Adicionales:
                            </Label>
                            <TextInput
                                id="observaciones"
                                type="text"
                                icon={HiClipboardCheck}
                                placeholder="Comparta sus comentarios adicionales..."
                                {...register("observaciones")}
                                className="mt-2"
                            />
                        </div>

                        {/* Preguntas Predefinidas */}
                        <div className="border-t border-gray-300 dark:border-gray-600 pt-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                                Por favor responda las siguientes preguntas:
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                El nivel de satisfacción se calculará automáticamente basado en sus respuestas.
                            </p>
                            <div className="space-y-6">
                                {PREGUNTAS_PREDEFINIDAS.map((pregunta) => (
                                    <div key={pregunta.id} className="space-y-2">
                                        <Label className="text-base font-medium text-gray-900 dark:text-white">
                                            {pregunta.pregunta}
                                        </Label>
                                        <div className="flex flex-wrap gap-4 mt-2">
                                            {pregunta.opciones.map((opcion) => (
                                                <div key={opcion} className="flex items-center">
                                                    <Radio
                                                        id={`pregunta_${pregunta.id}_${opcion}`}
                                                        name={`pregunta_${pregunta.id}`}
                                                        value={opcion}
                                                        {...register(`pregunta_${pregunta.id}`, {
                                                            required: `Por favor seleccione una opción para: ${pregunta.pregunta}`
                                                        })}
                                                        className="mr-2"
                                                    />
                                                    <Label 
                                                        htmlFor={`pregunta_${pregunta.id}_${opcion}`}
                                                        className="cursor-pointer text-gray-700 dark:text-gray-300"
                                                    >
                                                        {opcion}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                        {errors[`pregunta_${pregunta.id}`] && (
                                            <span className="text-red-500 text-sm block mt-1">
                                                {errors[`pregunta_${pregunta.id}`].message}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 justify-center pt-6">
                            <Button type="submit" size="lg" className="px-8">
                                Enviar Encuesta
                            </Button>
                            <Button 
                                type="button" 
                                color="gray" 
                                size="lg"
                                onClick={() => reset()}
                            >
                                Limpiar Formulario
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Footer simple */}
                <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
                    <p>© 2025 DentiFIA - Clínica Dental</p>
                </div>
            </div>
        </div>
    );
};

export default EncuestaPublica;

