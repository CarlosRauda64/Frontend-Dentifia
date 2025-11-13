import { useState, useEffect } from 'react';
import { Card, Button,TextInput, Modal, ModalBody, ModalHeader, Toast, ToastToggle } from 'flowbite-react';
import { HiCalendar, HiUser, HiInformationCircle, HiTrash, HiClock, HiOutlineExclamationCircle } from 'react-icons/hi';
import Navegacion from '../Common/Navegacion';
import { API_URL } from '../../api/api';
import { useAuth } from '../../auth/useAuth';
import { useNavigate } from 'react-router-dom';

const Citas = () => {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCita, setSelectedCita] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [filteredCitas, setFilteredCitas] = useState([]);
    const auth = useAuth();
    const navigate = useNavigate();

    const modalHandler = (selectedCita) => {
        setOpenModal(true);
        setSelectedCita(selectedCita);
    }

    const aceptarModal = () => {
        eliminarCita(selectedCita.id);
        setOpenModal(false);
        setSelectedCita('');
    }

    const cancelarModal = () => {
        setOpenModal(false);
        setSelectedCita('');
    }

    const mostrarToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000); // Ocultar luego de 3s
    };

    // Función para filtrar citas por fecha
    const filterCitasByDate = (date) => {
        if (!date) {
            setFilteredCitas(citas);
            return;
        }
        
        const filtered = citas.filter(cita => {
            if (!cita.fecha_hora) return false;
            const citaDate = cita.fecha_hora.split('T')[0];
            return citaDate === date;
        });
        
        setFilteredCitas(filtered);
    };

    // Efecto para cargar las citas
    useEffect(() => {
        const fetchCitas = async () => {
            try {
                const response = await fetch(`${API_URL}/citas/`, {
                    headers: {
                        'Authorization': `Bearer ${auth.getAccessToken()}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al cargar las citas');
                }

                const data = await response.json();
                setCitas(data);
                setFilteredCitas(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCitas();
    }, [auth]);

    // Efecto para filtrar citas cuando cambia la fecha seleccionada
    useEffect(() => {
        filterCitasByDate(selectedDate);
    }, [selectedDate, citas]);

    const formatDate = (dateString) => {
        if (!dateString) return { fecha: '', hora: '', raw: '' };
        const [datePart, timePart] = dateString.split('T');
        if (!datePart || !timePart) return { fecha: '', hora: '', raw: dateString };
        const [year, month, day] = datePart.split('-');
        let [hour, minute] = timePart.split(':');
        if (hour === undefined || minute === undefined) return { fecha: '', hora: '', raw: dateString };
        hour = parseInt(hour, 10);
        let ampm = 'AM';
        if (hour >= 12) {
            ampm = 'PM';
            if (hour > 12) hour -= 12;
        } else if (hour === 0) {
            hour = 12;
        }
        const hour12 = hour.toString().padStart(2, '0');
        return {
            fecha: `${day}/${month}/${year}`,
            hora: `${hour12}:${minute} ${ampm}`,
            raw: dateString
        };
    };

    const eliminarCita = async (id) => {
        try {
            await fetch(`${API_URL}/citas/eliminar/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                }
            });
            mostrarToast('Cita cancelada correctamente');
            const fetchCitas = async () => {
                try {
                    const response = await fetch(`${API_URL}/citas/`, {
                        headers: {
                            'Authorization': `Bearer ${auth.getAccessToken()}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Error al cargar las citas');
                    }

                    const data = await response.json();
                    setCitas(data);
                    setLoading(false);
                } catch (err) {
                    setError(err.message);
                    setLoading(false);
                }
            };
            fetchCitas();
        } catch (error) {
            console.error('Error al eliminar la cita:', error);
            mostrarToast('Error al cancelar la cita');
        }
    }

    const handleReprogramar = (citaId) => {
        navigate(`/citas/reprogramar/${citaId}`);
    };

    if (loading) return <div className="text-center p-4">Cargando citas...</div>;
    if (error) return <div className="text-center text-red-600 p-4">{error}</div>;

    return (
        <Navegacion>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            Agenda de Citas
                        </h1>
                      
                        <Button onClick={() => navigate('/citas/nueva')} color="blue">
                            <HiCalendar className="mr-2 h-4 w-4" />
                            Nueva Cita
                        </Button>
                    </div>
                </div>
  <div className="flex items-center gap-2 mb-6">
                            <p className=' text-gray-800 dark:text-white'>Buscar cita por fecha:</p>
                            <TextInput
                                type="date"
                                className=" px-4 py-2 rounded-lg  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                placeholder="Seleccionar fecha"
                            />
                            {selectedDate && (
                                <Button
                                    color="gray"
                                    size="sm"
                                    onClick={() => setSelectedDate('')}
                                >
                                    Limpiar
                                </Button>
                            )}
                        
                    </div>
                <div className="grid gap-6">
                    {filteredCitas.map((cita) => (
                        <Card key={cita.id} className="max-w-2xl mx-auto">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <HiUser className="text-blue-600 w-5 h-5" />
                                    <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        {cita.nombre_completo}
                                    </h5>
                                </div>

                                <div className="flex items-start space-x-2">
                                    <HiCalendar className="text-gray-600 w-5 h-5 mt-1" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Fecha:
                                        </span>
                                        <span className="text-base text-gray-800 dark:text-gray-200">
                                            {formatDate(cita.fecha_hora).fecha || formatDate(cita.fecha_hora).raw || 'Sin fecha'}
                                        </span>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                                            Hora:
                                        </span>
                                        <span className="text-base text-gray-800 dark:text-gray-200">
                                            {formatDate(cita.fecha_hora).hora || formatDate(cita.fecha_hora).raw || 'Sin hora'}
                                        </span>
                                    </div>
                                </div>

                                {cita.motivo && (
                                    <div className="flex items-start space-x-2">
                                        <HiInformationCircle className="text-gray-600 w-5 h-5 mt-1" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Motivo de la Cita:
                                            </span>
                                            <p className="text-base text-gray-800 dark:text-gray-200">
                                                {cita.motivo}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <Button 
                                        color="red" 
                                        size="sm"
                                        onClick={() => {
                                            setSelectedCita(cita);
                                           modalHandler(cita);
                                        }}
                                    >
                                        <HiTrash className="mr-2 h-4 w-4"  />
                                        Cancelar cita
                                    </Button>
                                    <Button 
                                        color="blue" 
                                        size="sm"
                                        onClick={() => handleReprogramar(cita.id)}
                                    >
                                        <HiClock className="mr-2 h-4 w-4" />
                                        Reprogramar
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
                {filteredCitas.length === 0 && (
                    <div className="text-center text-gray-600 dark:text-gray-400 mt-8">
                        No hay citas programadas.
                    </div>
                )}

                {/* Modal de Confirmación para Eliminar */}
                {openModal && (
                    <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup position="center">
                        <ModalHeader />
                        <ModalBody>
                            <div className="text-center">
                                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    ¿Estás seguro de que deseas cancelar la cita de <span className="font-semibold">{selectedCita.nombre_completo}</span>?
                                </h3>
                                <div className="flex justify-center gap-4">
                                    <Button color="green" onClick={() => aceptarModal()}>
                                        Aceptar
                                    </Button>
                                    <Button color="red" onClick={() => cancelarModal()}>
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>
                )}

                {/* Toast de notificación */}
                {showToast && (
                    <div className="fixed top-4 right-4 z-50">
                        <Toast>
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-500 dark:bg-yellow-800 dark:text-yellow-200">
                                <HiOutlineExclamationCircle className="h-5 w-5" />
                            </div>
                            <div className="ml-3 text-sm font-normal">
                                {toastMessage}
                            </div>
                            <ToastToggle onClick={() => setShowToast(false)} />
                        </Toast>
                    </div>
                )}
            
            </div>
        </Navegacion>
    );
};

export default Citas;