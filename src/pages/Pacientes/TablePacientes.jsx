import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalBody, ModalHeader, Button } from "flowbite-react";
import { useAuth } from "../../auth/useAuth";
import { API_URL } from '../../api/api';
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router";

const TablePacientes = ({ searchTerm }) => {
    const [pacientes, setPacientes] = useState([]);
    const [paciente, setPaciente] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const user = auth.getUser();
    const canEdit = user?.rol === 'doctor' || user?.rol === 'administrador';

    const modalHandler = (paciente) => {
        setOpenModal(true);
        setPaciente(paciente);
    }

    const aceptarModal = () => {
        eliminarPaciente(paciente.id);
        setOpenModal(false);
        setPaciente('');
    }

    const cancelarModal = () => {
        setOpenModal(false);
        setPaciente('');
    }

    const eliminarPaciente = async (id) => {
        try {
            const response = await fetch(`${API_URL}/pacientes/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Mostrar mensaje de error específico
                alert(errorData.error || 'Error al eliminar el paciente');
                return;
            }

            console.log("Paciente eliminado (lógicamente):", id);
            fetchPacientes();
        } catch (error) {
            console.error('Error al eliminar el paciente:', error);
            alert('Error de conexión al intentar eliminar el paciente');
        }
    }

    const fetchPacientes = async () => {
        try {
            const response = await fetch(`${API_URL}/pacientes/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener los pacientes');
            }
            const data = await response.json();
            console.log('Datos de pacientes recibidos:', data.results || data); // Debug
            setPacientes(data.results || data); // Manejar paginación si existe
        }
        catch (error) {
            console.error('Error fetching pacientes:', error);
        }
    }

    useEffect(() => {
        fetchPacientes();
    }, []);

    // Filtrar pacientes basados en el término de búsqueda
    const filteredPacientes = pacientes.filter(paciente => {
        const searchLower = searchTerm.toLowerCase();
        return (
            paciente.nombres?.toLowerCase().includes(searchLower) ||
            paciente.apellidos?.toLowerCase().includes(searchLower) ||
            paciente.dui?.toLowerCase().includes(searchLower) ||
            paciente.telefono?.toLowerCase().includes(searchLower) ||
            paciente.celular?.toLowerCase().includes(searchLower)
        );
    });


    return (
        <>
            {filteredPacientes.length === 0 && searchTerm && (
                <div className="text-center py-8 text-gray-500">
                    No se encontraron pacientes que coincidan con "{searchTerm}"
                </div>
            )}
            <div className="overflow-x-auto">
                <Table hoverable className="text-center">
                    <TableHead>
                        <TableRow>
                            <TableHeadCell>Nombre Completo</TableHeadCell>
                            <TableHeadCell className="max-sm:hidden">DUI</TableHeadCell>
                            <TableHeadCell>Teléfono</TableHeadCell>
                            <TableHeadCell className="max-lg:hidden">Edad</TableHeadCell>
                            {canEdit && <TableHeadCell>Editar</TableHeadCell>}
                            {canEdit && <TableHeadCell>Eliminar</TableHeadCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y">
                        {filteredPacientes.map((paciente) => (
                            <TableRow key={paciente.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {paciente.nombres} {paciente.apellidos}
                                </TableCell>
                                <TableCell className="max-sm:hidden">{paciente.dui || '-'}</TableCell>
                                <TableCell>{paciente.telefono}</TableCell>
                                <TableCell className="max-lg:hidden">{paciente.edad ? `${paciente.edad} años` : '-'}</TableCell>
                                {canEdit && (
                                    <TableCell>
                                        <HiOutlinePencilAlt href="#" size={25} className="cursor-pointer text-gray-500 hover:text-gray-700 mx-auto"
                                            onClick={() => navigate(`/pacientes/editar/${paciente.id}`)}
                                        />
                                    </TableCell>
                                )}
                                {canEdit && (
                                    <TableCell>
                                        <HiOutlineTrash size={25} className="cursor-pointer text-gray-500 hover:text-gray-700 mx-auto"
                                            onClick={() => modalHandler(paciente)}
                                        />
                                    </TableCell>
                                )}
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
                                ¿Estás seguro de que deseas eliminar al paciente <span className="font-semibold">{paciente.nombres} {paciente.apellidos}</span>?
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

export default TablePacientes;
