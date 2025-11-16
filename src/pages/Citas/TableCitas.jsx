import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalBody, ModalHeader, Button, Badge } from "flowbite-react";
import { useAuth } from "../../auth/useAuth";
import { API_URL } from '../../api/api';
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router";

const ESTADO_COLORS = {
    'programada': 'blue',
    'atendida': 'green',
    'cancelada': 'red',
    'reprogramada': 'yellow',
    'no_asistio': 'gray'
};

const ESTADO_LABELS = {
    'programada': 'Programada',
    'atendida': 'Atendida',
    'cancelada': 'Cancelada',
    'reprogramada': 'Reprogramada',
    'no_asistio': 'No Asistió'
};

const TableCitas = ({ searchTerm, estadoFilter }) => {
    const [citas, setCitas] = useState([]);
    const [cita, setCita] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const modalHandler = (citaItem) => {
        setOpenModal(true);
        setCita(citaItem);
    };

    const aceptarModal = () => {
        eliminarCita(cita.id);
        setOpenModal(false);
        setCita(null);
    };

    const cancelarModal = () => {
        setOpenModal(false);
        setCita(null);
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
            console.log("Cita eliminada:", id);
            fetchCitas();
        } catch (error) {
            console.error('Error al eliminar la cita:', error);
        }
    };

    const fetchCitas = async () => {
        try {
            const response = await fetch(`${API_URL}/citas/listar/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener las citas');
            }
            const data = await response.json();
            // Ordenar por fecha_hora descendente (más recientes primero)
            const sortedData = data.sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));
            setCitas(sortedData);
        } catch (error) {
            console.error('Error fetching citas:', error);
        }
    };

    useEffect(() => {
        fetchCitas();
    }, []);

    // Filtrar citas basadas en el término de búsqueda y estado
    const filteredCitas = citas.filter(cita => {
        const matchesSearch = !searchTerm || 
            (cita.nombre_completo && cita.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (cita.paciente_nombres && cita.paciente_nombres.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (cita.paciente_apellidos && cita.paciente_apellidos.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesEstado = !estadoFilter || cita.estado === estadoFilter;
        
        return matchesSearch && matchesEstado;
    });

    const formatFechaHora = (fechaHora) => {
        if (!fechaHora) return 'N/A';
        const date = new Date(fechaHora);
        return date.toLocaleString('es-SV', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <div className="overflow-x-auto">
                <Table hoverable className="text-center">
                    <TableHead>
                        <TableRow>
                            <TableHeadCell>Fecha y Hora</TableHeadCell>
                            <TableHeadCell>Paciente</TableHeadCell>
                            <TableHeadCell>Doctor</TableHeadCell>
                            <TableHeadCell>Estado</TableHeadCell>
                            <TableHeadCell className="max-xl:hidden">Motivo</TableHeadCell>
                            <TableHeadCell>Editar</TableHeadCell>
                            <TableHeadCell>Eliminar</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y">
                        {filteredCitas.map((cita) => (
                            <TableRow key={cita.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {formatFechaHora(cita.fecha_hora)}
                                </TableCell>
                                <TableCell>
                                    {cita.nombre_completo || 
                                     (cita.paciente_nombres && cita.paciente_apellidos 
                                        ? `${cita.paciente_nombres} ${cita.paciente_apellidos}` 
                                        : 'Sin paciente')}
                                </TableCell>
                                <TableCell>
                                    {cita.doctor_nombre || 'Sin asignar'}
                                </TableCell>
                                <TableCell>
                                    <Badge color={ESTADO_COLORS[cita.estado] || 'gray'}>
                                        {ESTADO_LABELS[cita.estado] || cita.estado}
                                    </Badge>
                                </TableCell>
                                <TableCell className="max-xl:hidden">
                                    {cita.motivo || 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <HiOutlinePencilAlt size={25} className="cursor-pointer text-gray-500 hover:text-gray-700 mx-auto"
                                        onClick={() => navigate(`/citas/editar/${cita.id}`)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <HiOutlineTrash size={25} className="cursor-pointer text-gray-500 hover:text-gray-700 mx-auto"
                                        onClick={() => modalHandler(cita)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {openModal && (
                <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup position="center">
                    <ModalHeader />
                    <ModalBody>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                ¿Estás seguro de que deseas eliminar la cita del {cita && formatFechaHora(cita.fecha_hora)}?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="green" onClick={() => aceptarModal()}>
                                    Sí, eliminar
                                </Button>
                                <Button color="red" onClick={() => cancelarModal()}>
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            )}
        </>
    )
}

export default TableCitas;

