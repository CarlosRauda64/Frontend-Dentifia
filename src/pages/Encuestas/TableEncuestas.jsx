import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalBody, ModalHeader, Button, Badge } from "flowbite-react";
import { useAuth } from "../../auth/useAuth";
import { API_URL } from '../../api/api';
import { HiOutlineTrash, HiOutlineExclamationCircle, HiChevronDown, HiChevronUp, HiStar } from "react-icons/hi";

const TableEncuestas = ({ searchTerm, desdeFilter, hastaFilter }) => {
    const [encuestas, setEncuestas] = useState([]);
    const [encuesta, setEncuesta] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [expandedRows, setExpandedRows] = useState(new Set());
    const auth = useAuth();

    const modalHandler = (encuestaItem) => {
        setOpenModal(true);
        setEncuesta(encuestaItem);
    };

    const aceptarModal = () => {
        eliminarEncuesta(encuesta.id);
        setOpenModal(false);
        setEncuesta(null);
    };

    const cancelarModal = () => {
        setOpenModal(false);
        setEncuesta(null);
    };

    const toggleRow = (id) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const eliminarEncuesta = async (id) => {
        try {
            await fetch(`${API_URL}/encuestas/eliminar_encuesta/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                }
            });
            console.log("Encuesta eliminada:", id);
            fetchEncuestas();
        } catch (error) {
            console.error('Error al eliminar la encuesta:', error);
        }
    };

    const fetchEncuestas = async () => {
        try {
            const response = await fetch(`${API_URL}/encuestas/encuestas/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener las encuestas');
            }
            const data = await response.json();
            const encuestasData = Array.isArray(data) ? data : (data.results || []);
            // Ordenar por fecha descendente (más recientes primero)
            const sortedData = encuestasData.sort((a, b) => {
                const fechaA = a.fecha ? new Date(a.fecha) : new Date(0);
                const fechaB = b.fecha ? new Date(b.fecha) : new Date(0);
                return fechaB - fechaA;
            });
            setEncuestas(sortedData);
        } catch (error) {
            console.error('Error fetching encuestas:', error);
        }
    };

    useEffect(() => {
        fetchEncuestas();
    }, []);

    // Filtrar encuestas basadas en el término de búsqueda y rango de fechas
    const filteredEncuestas = encuestas.filter(encuesta => {
        const matchesSearch = !searchTerm || 
            (encuesta.observaciones && encuesta.observaciones.toLowerCase().includes(searchTerm.toLowerCase()));
        
        let matchesFecha = true;
        if (desdeFilter || hastaFilter) {
            const fechaEncuesta = encuesta.fecha ? new Date(encuesta.fecha) : null;
            if (desdeFilter && fechaEncuesta) {
                const desde = new Date(desdeFilter);
                desde.setHours(0, 0, 0, 0);
                if (fechaEncuesta < desde) matchesFecha = false;
            }
            if (hastaFilter && fechaEncuesta) {
                const hasta = new Date(hastaFilter);
                hasta.setHours(23, 59, 59, 999);
                if (fechaEncuesta > hasta) matchesFecha = false;
            }
        }
        
        return matchesSearch && matchesFecha;
    });

    const formatFecha = (fecha) => {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-SV', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const renderPreguntasRespuestas = (preguntasRespuestas) => {
        if (!preguntasRespuestas || Object.keys(preguntasRespuestas).length === 0) {
            return <div className="text-gray-500 dark:text-gray-400 italic">No hay preguntas/respuestas registradas</div>;
        }
        
        return (
            <div className="space-y-2">
                {Object.entries(preguntasRespuestas).map(([pregunta, respuesta], index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-3 py-1">
                        <div className="font-medium text-gray-900 dark:text-white">{pregunta}</div>
                        <div className="text-gray-600 dark:text-gray-300">{respuesta}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <div className="overflow-x-auto">
                <Table hoverable className="text-center">
                    <TableHead>
                        <TableRow>
                            <TableHeadCell>Fecha</TableHeadCell>
                            <TableHeadCell>Nivel Satisfacción</TableHeadCell>
                            <TableHeadCell className="max-xl:hidden">Observaciones</TableHeadCell>
                            <TableHeadCell>Preguntas/Respuestas</TableHeadCell>
                            <TableHeadCell>Eliminar</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y">
                        {filteredEncuestas.map((encuesta) => (
                            <>
                                <TableRow key={encuesta.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {formatFecha(encuesta.fecha)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <HiStar
                                                    key={star}
                                                    className={`h-5 w-5 ${
                                                        star <= encuesta.nivel_satisfaccion
                                                            ? encuesta.nivel_satisfaccion >= 4
                                                                ? 'text-green-500 fill-green-500'
                                                                : encuesta.nivel_satisfaccion >= 3
                                                                ? 'text-yellow-500 fill-yellow-500'
                                                                : 'text-orange-500 fill-orange-500'
                                                            : 'text-gray-300 dark:text-gray-600'
                                                    }`}
                                                />
                                            ))}
                                            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {encuesta.nivel_satisfaccion}/5
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-xl:hidden">{encuesta.observaciones || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            color="gray"
                                            onClick={() => toggleRow(encuesta.id)}
                                        >
                                            {expandedRows.has(encuesta.id) ? (
                                                <HiChevronUp className="h-4 w-4" />
                                            ) : (
                                                <HiChevronDown className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <HiOutlineTrash size={25} className="cursor-pointer text-gray-500 hover:text-gray-700 mx-auto"
                                            onClick={() => modalHandler(encuesta)}
                                        />
                                    </TableCell>
                                </TableRow>
                                {expandedRows.has(encuesta.id) && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-left bg-gray-50 dark:bg-gray-900">
                                            <div className="p-4">
                                                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Preguntas y Respuestas:</h4>
                                                {renderPreguntasRespuestas(encuesta.preguntas_respuestas)}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
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
                                ¿Estás seguro de que deseas eliminar la encuesta del {encuesta && formatFecha(encuesta.fecha)}?
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

export default TableEncuestas;

