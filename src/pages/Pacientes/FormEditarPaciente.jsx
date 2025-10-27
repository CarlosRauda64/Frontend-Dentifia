import { useForm } from 'react-hook-form'
import { Button, Label, TextInput, Select, Textarea } from "flowbite-react";
import Navegacion from '../Common/Navegacion';
import DatosMedicosForm from './DatosMedicosForm';
import {
    HiUser,
    HiPhone,
    HiMail,
    HiCalendar,
    HiOutlineClipboard,
} from "react-icons/hi";
import { API_URL } from '../../api/api';
import { useAuth } from '../../auth/useAuth';
import { useNavigate, useParams } from 'react-router';
import { useState, useEffect } from 'react';

const FormEditarPaciente = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [datosMedicos, setDatosMedicos] = useState({});

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm();

    // Cargar datos del paciente
    useEffect(() => {
        const fetchPaciente = async () => {
            try {
                const response = await fetch(`${API_URL}/pacientes/${id}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.getAccessToken()}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al obtener el paciente');
                }

                const data = await response.json();
                setPaciente(data);
                setDatosMedicos(data.datos_medicos || {});
                
                // Pre-poblar el formulario
                setValue('nombres', data.nombres);
                setValue('apellidos', data.apellidos);
                setValue('fecha_nacimiento', data.fecha_nacimiento);
                setValue('telefono', data.telefono);
                setValue('dui', data.dui || '');
                setValue('sexo', data.sexo || '');
                setValue('celular', data.celular || '');
                setValue('email', data.email || '');
                setValue('direccion', data.direccion || '');
                
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar el paciente:', error);
                setLoading(false);
            }
        };

        if (id) {
            fetchPaciente();
        }
    }, [id, auth, setValue]);

    const actualizarPaciente = async (data) => {
        try {
            // Incluir datos médicos en la actualización
            const dataToSend = {
                ...data,
                datos_medicos: datosMedicos
            };

            const response = await fetch(`${API_URL}/pacientes/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error del servidor:', errorData);
                throw new Error('Error al actualizar el paciente');
            } else {
                navigate('/pacientes');
            }
        } catch (error) {
            console.error('Error al actualizar el paciente:', error);
        }
    }

    const handleDatosMedicosChange = (nuevosDatosMedicos) => {
        setDatosMedicos(nuevosDatosMedicos);
    };

    const onSubmit = async (data) => {
        await actualizarPaciente(data);
    }

    if (loading) {
        return (
            <Navegacion>
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Cargando datos del paciente...</div>
                </div>
            </Navegacion>
        );
    }

    if (!paciente) {
        return (
            <Navegacion>
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-red-500">Error al cargar el paciente</div>
                </div>
            </Navegacion>
        );
    }

    return (
        <Navegacion>
            <div className="flex flex-col items-center sm:justify-center w-full h-full max-sm:mt-10">
                <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Editar Paciente</h1>
                <form className="flex flex-col gap-4 dark:bg-gray-800 bg-white p-10 rounded-2xl w-[75%] max-w-4xl lg:grid lg:grid-cols-2 lg:max-w-6xl" onSubmit={handleSubmit(onSubmit)}>
                    
                    {/* Nombres - Campo obligatorio */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="nombres">Nombres: *</Label>
                        </div>
                        <TextInput
                            id="nombres"
                            type="text"
                            icon={HiUser}
                            placeholder="Nombres del paciente"
                            {...register("nombres", {
                                required: {
                                    value: true,
                                    message: "Este campo es obligatorio"
                                },
                                maxLength: {
                                    value: 200,
                                    message: "Máximo 200 caracteres"
                                }
                            })}
                        />
                        {errors.nombres && <span className="font-medium text-red-500">{errors.nombres.message}</span>}
                    </div>

                    {/* Apellidos - Campo obligatorio */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="apellidos">Apellidos: *</Label>
                        </div>
                        <TextInput
                            id="apellidos"
                            type="text"
                            icon={HiUser}
                            placeholder="Apellidos del paciente"
                            {...register("apellidos", {
                                required: {
                                    value: true,
                                    message: "Este campo es obligatorio"
                                },
                                maxLength: {
                                    value: 200,
                                    message: "Máximo 200 caracteres"
                                }
                            })}
                        />
                        {errors.apellidos && <span className="font-medium text-red-500">{errors.apellidos.message}</span>}
                    </div>

                    {/* Fecha de Nacimiento - Campo obligatorio */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento: *</Label>
                        </div>
                        <TextInput
                            id="fecha_nacimiento"
                            type="date"
                            icon={HiCalendar}
                            {...register("fecha_nacimiento", {
                                required: {
                                    value: true,
                                    message: "Este campo es obligatorio"
                                },
                                validate: {
                                    notFuture: (value) => {
                                        const today = new Date();
                                        const birthDate = new Date(value);
                                        return birthDate <= today || "La fecha no puede ser futura";
                                    },
                                    notTooOld: (value) => {
                                        const birthDate = new Date(value);
                                        const year1900 = new Date('1900-01-01');
                                        return birthDate >= year1900 || "La fecha debe ser posterior a 1900";
                                    }
                                }
                            })}
                        />
                        {errors.fecha_nacimiento && <span className="font-medium text-red-500">{errors.fecha_nacimiento.message}</span>}
                    </div>

                    {/* Teléfono - Campo obligatorio */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="telefono">Teléfono: *</Label>
                        </div>
                        <TextInput
                            id="telefono"
                            type="tel"
                            icon={HiPhone}
                            placeholder="7777-8888"
                            {...register("telefono", {
                                required: {
                                    value: true,
                                    message: "Este campo es obligatorio"
                                },
                                maxLength: {
                                    value: 20,
                                    message: "Máximo 20 caracteres"
                                }
                            })}
                        />
                        {errors.telefono && <span className="font-medium text-red-500">{errors.telefono.message}</span>}
                    </div>

                    {/* DUI - Campo opcional */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="dui">DUI:</Label>
                        </div>
                        <TextInput
                            id="dui"
                            type="text"
                            icon={HiOutlineClipboard}
                            placeholder="12345678-9"
                            {...register("dui", {
                                pattern: {
                                    value: /^\d{8}-\d{1}$/,
                                    message: "Formato debe ser 12345678-9"
                                }
                            })}
                        />
                        {errors.dui && <span className="font-medium text-red-500">{errors.dui.message}</span>}
                    </div>

                    {/* Sexo - Campo opcional */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="sexo">Sexo:</Label>
                        </div>
                        <Select id="sexo" {...register("sexo")}>
                            <option value="">Seleccionar sexo</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                            <option value="X">Otro</option>
                        </Select>
                    </div>

                    {/* Celular - Campo opcional */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="celular">Celular:</Label>
                        </div>
                        <TextInput
                            id="celular"
                            type="tel"
                            icon={HiPhone}
                            placeholder="7777-8888"
                            {...register("celular", {
                                maxLength: {
                                    value: 20,
                                    message: "Máximo 20 caracteres"
                                }
                            })}
                        />
                        {errors.celular && <span className="font-medium text-red-500">{errors.celular.message}</span>}
                    </div>

                    {/* Email - Campo opcional */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="email">Correo Electrónico:</Label>
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            icon={HiMail}
                            placeholder="correo@ejemplo.com"
                            {...register("email", {
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Formato de correo inválido"
                                }
                            })}
                        />
                        {errors.email && <span className="font-medium text-red-500">{errors.email.message}</span>}
                    </div>

                    {/* Dirección - Campo opcional, ocupa 2 columnas */}
                    <div className="max-w-md lg:col-span-2">
                        <div className="mb-2 block">
                            <Label htmlFor="direccion">Dirección:</Label>
                        </div>
                        <Textarea
                            id="direccion"
                            placeholder="Dirección completa del paciente"
                            rows={3}
                            {...register("direccion")}
                        />
                    </div>

                    {/* Datos Médicos */}
                    <div className="lg:col-span-2">
                        <DatosMedicosForm 
                            datosMedicos={datosMedicos}
                            onDatosMedicosChange={handleDatosMedicosChange}
                            sexo={paciente?.sexo}
                        />
                    </div>

                    {/* Botones */}
                    <div className='flex gap-2 justify-evenly items-center col-span-2'>
                        <Button type="submit" className="mt-4">Actualizar Paciente</Button>
                        <Button href="/pacientes" className="mt-4" color="red">Cancelar</Button>
                    </div>
                </form>
            </div>
        </Navegacion>
    )
}

export default FormEditarPaciente;
