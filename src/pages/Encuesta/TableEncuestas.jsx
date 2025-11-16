import { useState, useEffect, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalBody, ModalHeader, Button, Toast, ToastToggle } from "flowbite-react";
import { useAuth } from "../../auth/useAuth";
import { API_URL } from '../../api/api';
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlineExclamationCircle,HiOutlineEmojiSad,HiOutlineEmojiHappy,HiOutlineHeart, HiEye } from "react-icons/hi";
import { useNavigate } from "react-router";

const TableEncuestas = () => {
    const [encuestas, setEncuestas] = useState([]);
    const [encuesta, setEncuesta] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsEncuesta, setDetailsEncuesta] = useState(null);
    const tableRef = useRef(null)

    const navigate = useNavigate();
    const auth = useAuth();

    const modalHandler = (encuesta) => {
        setOpenModal(true);
        setEncuesta(encuesta);
    }

    const openDetails = (enc) => {
        setDetailsEncuesta(enc)
        setDetailsOpen(true)
    }

    const closeDetails = () => {
        setDetailsEncuesta(null)
        setDetailsOpen(false)
    }

    const closeAndScrollToTable = () => {
        setDetailsEncuesta(null)
        setDetailsOpen(false)
        try {
            if (tableRef?.current) {
                tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        } catch (e) {
            // ignore
        }
    }

    const aceptarModal = () => {
        eliminarEncuesta(encuesta.id);
        setOpenModal(false);
        setEncuesta('');
    }

    const cancelarModal = () => {
        setOpenModal(false);
        setEncuesta('');
    }

    const mostrarToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000); // Ocultar luego de 3s
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
            mostrarToast('Encuesta eliminada correctamente');
            fetchEncuestas();
        } catch (error) {
            console.error('Error al eliminar encuesta:', error);
        }
    }

    const fetchEncuestas = async () => {
        try {
            const response = await fetch(`${API_URL}/encuestas/listar`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener encuestas');
            }
            const data = await response.json();
            setEncuestas(data);
            console.log("Encuestas obtenidas:", data);
        }
        catch (error) {
            console.error('Error fetching encuestas:', error);
        }
    }

    useEffect(() => {
        fetchEncuestas();
    }, []);

    return (
        <>
            <div className="overflow-x-auto" ref={tableRef}>
                <Table hoverable className="text-center">
                    <TableHead>
                        <TableRow>
                            <TableHeadCell >Nivel de Satisfaccion</TableHeadCell>
                            <TableHeadCell>Acciones</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y">

                        {encuestas.map((encuesta) => (

                            <TableRow key={encuesta.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {encuesta.nivel_satisfaccion <=1 ? <HiOutlineEmojiSad size={25} className="mx-auto text-red-500"/> : encuesta.nivel_satisfaccion ===3 ? <HiOutlineHeart size={25} className="mx-auto text-blue-500"/> : <HiOutlineEmojiHappy size={25} className="mx-auto text-green-500"/>}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center gap-4">
                                        <HiEye
                                            size={20}
                                            className="cursor-pointer text-blue-600 hover:text-blue-800"
                                            onClick={() => openDetails(encuesta)}
                                            title="Ver observaciones"
                                        />
                                        <HiOutlineTrash
                                            size={20}
                                            className="cursor-pointer text-gray-500 hover:text-gray-700"
                                            onClick={() => modalHandler(encuesta)}
                                            title="Eliminar encuesta"
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {detailsOpen && (
                <Modal show={detailsOpen} size="lg" onClose={closeDetails} popup position="center">
                    <ModalHeader />
                    <ModalBody>
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Observaciones</h3>
                            <div className="p-3 border rounded bg-white dark:bg-gray-900 max-h-[60vh] overflow-auto text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                {detailsEncuesta?.observaciones || 'No hay observaciones.'}
                            </div>
                            <div className="mt-3 flex justify-center">
                                <Button color="gray" onClick={closeAndScrollToTable}>Volver a la tabla</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            )}
            {openModal && (
                <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup position="center">
                    <ModalHeader />
                    <ModalBody>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                ¿Estás seguro de que deseas eliminar esta encuesta?
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

        </>
    )
}
export default TableEncuestas;