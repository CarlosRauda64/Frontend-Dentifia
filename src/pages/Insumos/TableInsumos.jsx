import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalBody, ModalHeader, Button } from "flowbite-react";
import { useAuth } from "../../auth/useAuth";
import { API_URL } from '../../api/api';
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router";

const TableInsumos = () => {
    const [insumos, setInsumos] = useState([]);
    const [insumo, setInsumo] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const modalHandler = (insumo) => {
        setOpenModal(true);
        setInsumo(insumo);
    }

    const aceptarModal = () => {
        eliminarInsumo(insumo.id);
        setOpenModal(false);
        setInsumo('');
    }

    const cancelarModal = () => {
        setOpenModal(false);
        setInsumo('');
    }

    const eliminarInsumo = async (id) => {
        try {
            await fetch(`${API_URL}/inventario/insumos/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                }
            });
            console.log("Insumo eliminado (lógicamente):", id);
            fetchInsumos();
        } catch (error) {
            console.error('Error al eliminar el insumo:', error);
        }
    }

    const fetchInsumos = async () => {
        try {
            const response = await fetch(`${API_URL}/inventario/insumos/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener los insumos');
            }
            const data = await response.json();
            setInsumos(data);
        }
        catch (error) {
            console.error('Error fetching insumos:', error);
        }
    }

    useEffect(() => {
        fetchInsumos();
    }, []);

    return (
        <>
            <div className="overflow-x-auto">
                <Table hoverable className="text-center">
                    <TableHead>
                        <TableRow>
                            <TableHeadCell>Nombre</TableHeadCell>
                            <TableHeadCell className="max-xl:hidden">Descripción</TableHeadCell>
                            <TableHeadCell>Stock Actual</TableHeadCell>
                            <TableHeadCell>Editar</TableHeadCell>
                            <TableHeadCell>Eliminar</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y">
                        {insumos.map((insumo) => (
                            <TableRow key={insumo.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {insumo.nombre}
                                </TableCell>
                                <TableCell className="max-xl:hidden">{insumo.descripcion}</TableCell>
                                <TableCell>{insumo.stock_actual}</TableCell>
                                <TableCell>
                                    <HiOutlinePencilAlt href="#" size={25} className="cursor-pointer text-gray-500 hover:text-gray-700 mx-auto"
                                        onClick={() => navigate(`/inventario/insumos/editar/${insumo.id}`)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <HiOutlineTrash size={25} className="cursor-pointer text-gray-500 hover:text-gray-700 mx-auto"
                                        onClick={() => modalHandler(insumo)}
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
                                ¿Estás seguro de que deseas eliminar el insumo <span className="font-semibold">{insumo.nombre}</span>?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" onClick={() => aceptarModal()}>
                                    Sí, eliminar
                                </Button>
                                <Button color="gray" onClick={() => cancelarModal()}>
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

export default TableInsumos;