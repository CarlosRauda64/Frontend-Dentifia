import { useState, useEffect } from 'react';
import { Button, Label, TextInput, Select } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import { HiCalendar, HiUser, HiInformationCircle } from 'react-icons/hi';
import Navegacion from '../Common/Navegacion';
import { API_URL } from '../../api/api';
import { useAuth } from '../../auth/useAuth';

const CrearCita = () => {
    const [pacientes, setPacientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        paciente: '',
        nombrePaciente: '',
        fecha: '',
        hora: '',
        ampm: 'AM',
        motivo: ''
    });
    
    const filteredPacientes = pacientes.filter(paciente => 
        paciente.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const response = await fetch(`${API_URL}/pacientes/`, {
                    headers: {
                        'Authorization': `Bearer ${auth.getAccessToken()}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al cargar los pacientes');
                }

                const data = await response.json();
                setPacientes(data);
            } catch (err) {
                setError('Error al cargar los pacientes: ' + err.message);
            }
        };

        fetchPacientes();
    }, [auth]);

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
                paciente: formData.paciente || null,
                nombre_completo: formData.nombrePaciente,
                fecha_hora,
                motivo: formData.motivo
            };

            const response = await fetch(`${API_URL}/citas/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                },
                body: JSON.stringify(formDataAjustado)
            });

            if (!response.ok) {
                throw new Error('Error al crear la cita');
            }

            navigate('/citas');
        } catch (err) {
            setError('¡Verifique la hora de la cita! ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            if (name === 'paciente' && value !== '') {
                // Cuando se selecciona un paciente, buscar su nombre completo
                const pacienteSeleccionado = pacientes.find(p => p.id.toString() === value);
                return {
                    ...prev,
                    [name]: value,
                    nombrePaciente: pacienteSeleccionado ? pacienteSeleccionado.nombre_completo : ''
                };
            }
            
            return {
                ...prev,
                [name]: value
            };
        });
    };

    return (
        <Navegacion>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                    Crear Nueva Cita
                </h1>

                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                    {error && (
                        <div className="p-4 text-red-600 bg-red-100 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="paciente">Seleccionar Paciente Existente</Label>
                            <div className="space-y-2">
                                <TextInput
                                    type="text"
                                    placeholder="Buscar paciente por nombre..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    icon={HiUser}
                                />
                                <Select
                                    id="paciente"
                                    name="paciente"
                                    value={formData.paciente}
                                    onChange={handleChange}
                                    className="w-full"
                                >
                                    <option value="">Ver resultados</option>
                                    {filteredPacientes.map(paciente => (
                                        <option key={paciente.id} value={paciente.id}>
                                            {paciente.nombre_completo}
                                        </option>
                                    ))}
                                </Select>
                                {searchTerm && filteredPacientes.length === 0 && (
                                    <p className="text-sm text-gray-500">
                                        No se encontraron pacientes con ese nombre
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        <div>
                            <Label htmlFor="nombrePaciente">O Ingresar Nombre del Paciente</Label>
                            <TextInput
                                id="nombrePaciente"
                                name="nombrePaciente"
                                type="text"
                                value={formData.nombrePaciente}
                                onChange={handleChange}
                                icon={HiUser}
                                placeholder="Ingrese el nombre del paciente"
                                
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Label htmlFor="fecha">Fecha</Label>
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
                            <Label htmlFor="hora">Hora</Label>
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
                            placeholder="Describa el motivo de la cita"
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
                            disabled={loading}
                        >
                            {loading ? 'Creando...' : 'Crear Cita'}
                        </Button>
                    </div>
                </form>
            </div>
        </Navegacion>
    );
};

export default CrearCita;