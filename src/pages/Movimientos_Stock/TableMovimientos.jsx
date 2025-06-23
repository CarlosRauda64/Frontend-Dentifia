import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalBody, ModalHeader, Button, Toast, ToastToggle } from "flowbite-react";
import { useAuth } from "../../auth/useAuth";
import { API_URL } from '../../api/api';
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router";

const TableMovimientos = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [movimiento, setMovimiento] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [insumos, setInsumos] = useState([]);


    const navigate = useNavigate();
    const auth = useAuth();

    const modalHandler = (movimiento) => {
        setOpenModal(true);
        setMovimiento(movimiento);
    }

    const aceptarModal = () => {
        eliminarUsuario(movimiento.id);
        setOpenModal(false);
        setMovimiento('');
    }

    const cancelarModal = () => {
        setOpenModal(false);
        setMovimiento('');
    }

    const mostrarToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000); // Ocultar luego de 3s
    };
    const eliminarUsuario = async (id) => {
        try {
            await fetch(`${API_URL}/inventario/movimiento_stock/eliminar/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                }
            });
            console.log("Movimiento cancelado:", id);
            fetchMovimientos();
        } catch (error) {
            console.error('Error al cancelar movimiento:', error);
        }
    }
    const fetchInsumos = async () => {
        try {
            const response = await fetch(`${API_URL}/inventario/insumos/`, {
                headers: {
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                }
            });
            if (!response.ok) throw new Error("Error al cargar insumos");
            const data = await response.json();
            setInsumos(data); // Suponiendo que cada insumo tiene id y nombre
        } catch (error) {
            console.error("Error cargando insumos:", error);
        }
    };
    const fetchMovimientos = async () => {
        try {
            const response = await fetch(`${API_URL}/inventario/movimientos_stock`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener los movimientos de stock');
            }
            const data = await response.json();
            setMovimientos(data);
        }
        catch (error) {
            console.error('Error fetching usuarios:', error);
        }
    }

    const getNombreInsumo = (id) => {
        const insumo = insumos.find((i) => i.id === id);
        return insumo ? insumo.nombre : `ID: ${id}`;
    };

    useEffect(() => {
        fetchMovimientos();
        fetchInsumos();
    }, []);

    return (
        <>
            <div className="overflow-x-auto">
                <Table hoverable className="text-center">
                    <TableHead>
                        <TableRow>
                            <TableHeadCell >Tipo</TableHeadCell>
                            <TableHeadCell className="max-xl:hidden">Fecha</TableHeadCell>
                            <TableHeadCell className="max-xl:hidden">Cantidad</TableHeadCell>
                            <TableHeadCell >Insumo</TableHeadCell>
                            <TableHeadCell className="max-sm:hidden">Nombre usuario</TableHeadCell>
                            <TableHeadCell className="max-sm:hidden">Rol de usuario</TableHeadCell>
                            <TableHeadCell className="max-sm:hidden">Estado</TableHeadCell>
                            <TableHeadCell>Editar</TableHeadCell>
                            <TableHeadCell>Eliminar</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y">

                        {movimientos.map((movimiento) => (

                            <TableRow key={movimiento.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {movimiento.tipo}
                                </TableCell>
                                <TableCell className="max-xl:hidden">{movimiento.fecha}</TableCell>
                                <TableCell className="max-xl:hidden">{movimiento.cantidad}</TableCell>
                                <TableCell>
                                    {movimiento.insumo_data?.nombre || 'Insumo no encontrado'}
                                    {!movimiento.insumo_data?.activo && <span className="text-sm font-semibold text-red-500 ml-2">(Descatalogado)</span>}
                                </TableCell>
                                <TableCell className="max-sm:hidden">{movimiento.nombre_usuario}</TableCell>
                                <TableCell className="max-sm:hidden">{movimiento.rol_usuario}</TableCell>
                                <TableCell className="max-sm:hidden">{movimiento.activo ? "Realizado" : "Cancelado"}</TableCell>

                                <TableCell>
                                    <HiOutlinePencilAlt href="#" size={25} className="cursor-pointer text-gray-500 hover:text-gray-700 mx-auto"
                                        onClick={() => movimiento.activo ? navigate(`/inventario/movimientos_stock/editar/${movimiento.id}`) : mostrarToast("No se puede editar un movimiento cancelado")}
                                    />
                                </TableCell>
                                <TableCell>
                                    <HiOutlineTrash size={25} className="cursor-pointer text-gray-500 hover:text-gray-700 mx-auto"
                                        onClick={() => modalHandler(movimiento)}
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
                                ¿Estás seguro de que deseas cancelar este movimiento? <span className="font-semibold">{movimiento.fecha},{movimiento.tipo}</span>?
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
export default TableMovimientos;