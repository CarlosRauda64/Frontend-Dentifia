import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Button, Label, TextInput, Select } from "flowbite-react";
import Navegacion from '../Common/Navegacion';
import { HiCalendar, HiUser, HiClipboard } from "react-icons/hi";
import { API_URL } from '../../api/api';
import { useAuth } from '../../auth/useAuth';
import { useNavigate, useParams } from 'react-router';
import BuscarPacienteInput from '../factura/BuscarPacienteInput';

const FormEditarCita = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
    const [doctores, setDoctores] = useState([]);
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm();

    useEffect(() => {
        const fetchDoctores = async () => {
            try {
                const response = await fetch(`${API_URL}/usuarios/listar_usuarios`, {
                    headers: {
                        'Authorization': `Bearer ${auth.getAccessToken()}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    const doctoresData = data.filter(user => user.rol === 'doctor');
                    setDoctores(doctoresData);
                }
            } catch (error) {
                console.error('Error al obtener doctores:', error);
            }
        };
        fetchDoctores();
    }, [auth]);

    useEffect(() => {
        const fetchCita = async () => {
            try {
                const response = await fetch(`${API_URL}/citas/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${auth.getAccessToken()}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    
                    // Formatear fecha_hora para datetime-local (YYYY-MM-DDTHH:mm)
                    if (data.fecha_hora) {
                        const fecha = new Date(data.fecha_hora);
                        const fechaLocal = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
                        data.fecha_hora = fechaLocal.toISOString().slice(0, 16);
                    }
                    
                    setValue("fecha_hora", data.fecha_hora || '');
                    setValue("estado", data.estado || 'programada');
                    setValue("motivo", data.motivo || '');
                    setValue("doctor", data.doctor || '');
                    
                    // Si hay paciente, cargarlo
                    if (data.paciente) {
                        const pacienteData = {
                            id: data.paciente,
                            nombre_completo: data.nombre_completo || 
                                (data.paciente_nombres && data.paciente_apellidos 
                                    ? `${data.paciente_nombres} ${data.paciente_apellidos}` 
                                    : 'Paciente')
                        };
                        setPacienteSeleccionado(pacienteData);
                    } else if (data.nombre_completo) {
                        setValue("nombre_completo", data.nombre_completo);
                    }
                    
                    reset(data);
                } else {
                    console.error("Error al obtener datos de la cita.");
                }
            } catch (error) {
                console.error("Error al cargar cita:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCita();
    }, [id, reset, setValue, auth]);

    const editarCita = async (data) => {
        const dataToSend = {
            fecha_hora: data.fecha_hora,
            estado: data.estado,
            motivo: data.motivo || '',
            paciente: pacienteSeleccionado ? pacienteSeleccionado.id : null,
            nombre_completo: pacienteSeleccionado ? null : data.nombre_completo || null,
            doctor: data.doctor || null,
        };

        try {
            const response = await fetch(`${API_URL}/citas/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al editar la cita');
            } else {
                navigate('/citas');
            }
        } catch (error) {
            console.error('Error al editar la cita:', error);
            alert(error.message || 'Error al editar la cita. Por favor, intente nuevamente.');
        }
    };

    const onSubmit = async (data) => {
        await editarCita(data);
    };

    if (loading) {
        return (
            <Navegacion>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Cargando cita...</p>
                    </div>
                </div>
            </Navegacion>
        );
    }

    return (
        <Navegacion>
            <div className="flex flex-col items-center sm:justify-center w-full h-full max-sm:mt-10">
                <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Editar Cita</h1>
                <form className="flex flex-col gap-4 dark:bg-gray-800 bg-white p-10 rounded-2xl w-[75%] max-w-2xl" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Label htmlFor="paciente">Paciente (Opcional)</Label>
                        <BuscarPacienteInput
                            onPacienteSelected={setPacienteSeleccionado}
                            pacienteSeleccionado={pacienteSeleccionado}
                        />
                    </div>

                    {!pacienteSeleccionado && (
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="nombre_completo">Nombre Completo del Paciente (si no está registrado)</Label>
                            </div>
                            <TextInput
                                id="nombre_completo"
                                type="text"
                                icon={HiUser}
                                placeholder="Nombre completo del paciente"
                                {...register("nombre_completo")}
                            />
                        </div>
                    )}

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="fecha_hora">Fecha y Hora:</Label>
                        </div>
                        <TextInput
                            id="fecha_hora"
                            type="datetime-local"
                            icon={HiCalendar}
                            {...register("fecha_hora", { required: "Este campo es obligatorio" })}
                        />
                        {errors.fecha_hora && <span className="font-medium text-red-500">{errors.fecha_hora.message}</span>}
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="doctor">Doctor (Opcional)</Label>
                        </div>
                        <Select
                            id="doctor"
                            {...register("doctor")}
                        >
                            <option value="">Seleccionar doctor</option>
                            {doctores.map(doctor => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.nombre} {doctor.apellido}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="estado">Estado:</Label>
                        </div>
                        <Select
                            id="estado"
                            {...register("estado", { required: "Este campo es obligatorio" })}
                        >
                            <option value="programada">Programada</option>
                            <option value="atendida">Atendida</option>
                            <option value="cancelada">Cancelada</option>
                            <option value="reprogramada">Reprogramada</option>
                            <option value="no_asistio">No Asistió</option>
                        </Select>
                        {errors.estado && <span className="font-medium text-red-500">{errors.estado.message}</span>}
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="motivo">Motivo de la Cita:</Label>
                        </div>
                        <TextInput
                            id="motivo"
                            type="text"
                            icon={HiClipboard}
                            placeholder="Motivo de la consulta"
                            {...register("motivo")}
                        />
                    </div>

                    <div className='flex gap-2 justify-evenly items-center col-span-2'>
                        <Button type="submit" className="mt-4">Actualizar Cita</Button>
                        <Button href="/citas" className="mt-4" color="red">Cancelar</Button>
                    </div>
                </form>
            </div>
        </Navegacion>
    )
}

export default FormEditarCita;

