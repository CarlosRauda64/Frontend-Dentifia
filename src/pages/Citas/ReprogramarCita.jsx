import { useState, useEffect } from 'react';
import { Button, Label, TextInput } from "flowbite-react";
import { useNavigate, useParams } from 'react-router-dom';
import { HiCalendar, HiInformationCircle } from 'react-icons/hi';
import Navegacion from '../Common/Navegacion';
import { API_URL } from '../../api/api';
import { useAuth } from '../../auth/useAuth';

const ReprogramarCita = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        fecha: '',
        hora: '',
        ampm: 'AM',
        motivo: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        const fetchCita = async () => {
            try {
                const response = await fetch(`${API_URL}/citas/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${auth.getAccessToken()}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al cargar la cita');
                }

                const data = await response.json();
                // Convertir 'YYYY-MM-DD HH:mm' a fecha, hora y AM/PM
                let fecha = '', hora = '', ampm = 'AM';
                if (data.fecha_hora && data.fecha_hora.includes('T')) {
                    const [f, h] = data.fecha_hora.split('T');
                    fecha = f;
                    let [hour, minute] = h.split(":");
                    hour = parseInt(hour, 10);
                    if (hour >= 12) {
                        ampm = 'PM';
                        if (hour > 12) hour -= 12;
                    } else {
                        ampm = 'AM';
                        if (hour === 0) hour = 12;
                    }
                    hora = `${hour.toString().padStart(2, '0')}:${minute}`;
                }
                setFormData({
                    fecha,
                    hora,
                    ampm,
                    motivo: data.motivo || ''
                });
                setLoading(false);
            } catch (err) {
                setError('Error al cargar la cita: ' + err.message);
                setLoading(false);
            }
        };

        fetchCita();
    }, [id, auth]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Convertir hora y AM/PM a 24 horas
            let [hour, minute] = formData.hora.split(":");
            hour = parseInt(hour, 10);
            if (formData.ampm === "PM" && hour < 12) hour += 12;
            if (formData.ampm === "AM" && hour === 12) hour = 0;
            const hora24 = `${hour.toString().padStart(2, '0')}:${minute}`;
            const fecha_hora = `${formData.fecha} ${hora24}`;

            const formDataAjustado = {
                fecha_hora,
                motivo: formData.motivo
            };

            const response = await fetch(`${API_URL}/citas/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                },
                body: JSON.stringify(formDataAjustado)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la cita');
            }

            navigate('/citas');
        } catch (err) {
            setError('Error al actualizar la cita: ' + err.message);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <Navegacion>
                <div className="text-center p-4">Cargando...</div>
            </Navegacion>
        );
    }

    return (
        <Navegacion>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                    Reprogramar Cita
                </h1>

                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                    {error && (
                        <div className="p-4 text-red-600 bg-red-100 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Label htmlFor="fecha">Nueva Fecha</Label>
                            <TextInput
                                id="fecha"
                                name="fecha"
                                type="date"
                                required
                                value={formData.fecha}
                                onChange={handleChange}
                                icon={HiCalendar}
                            />
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="hora">Nueva Hora</Label>
                            <div className="flex gap-2">
                                <TextInput
                                    id="hora"
                                    name="hora"
                                    type="time"
                                    required
                                    value={formData.hora}
                                    onChange={handleChange}
                                />
                                <select
                                    id="ampm"
                                    name="ampm"
                                    value={formData.ampm}
                                    onChange={handleChange}
                                    className="block w-full rounded border-gray-300 bg-white text-gray-900 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 text-sm"
                                    style={{ maxWidth: 70 }}
                                >
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="motivo">Motivo de la Cita</Label>
                        <TextInput
                            id="motivo"
                            name="motivo"
                            type="text"
                            value={formData.motivo}
                            onChange={handleChange}
                            icon={HiInformationCircle}
                            placeholder="Actualice el motivo de la cita si es necesario"
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button
                            color="gray"
                            onClick={() => navigate('/citas')}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            color="blue"
                            disabled={loading}
                        >
                            {loading ? 'Actualizando...' : 'Reprogramar Cita'}
                        </Button>
                    </div>
                </form>
            </div>
        </Navegacion>
    );
};

export default ReprogramarCita;