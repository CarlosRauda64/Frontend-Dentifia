import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalBody, ModalHeader, Button } from "flowbite-react";
import { useAuth } from "../../auth/useAuth";
import { API_URL } from '../../api/api';
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlineExclamationCircle } from "react-icons/hi";

const TableUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuario, setUsuario] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const auth = useAuth();

    const modalHandler = (usuario) => {
        setOpenModal(true);
        setUsuario(usuario);
    }

    const aceptarModal = () => {
        eliminarUsuario(usuario.id);
        setOpenModal(false);
        setUsuario('');
    }

    const cancelarModal = () => {
        setOpenModal(false);
        setUsuario('');
    }

    const eliminarUsuario = async (id) => {
        try {
            await fetch(`${API_URL}/usuarios/api_usuarios/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                }
            });
            console.log("Usuario eliminado:", id);
            fetchUsuarios();
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    }

    const fetchUsuarios = async () => {
        try {
            const response = await fetch(`${API_URL}/usuarios/api_usuarios`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener los usuarios');
            }
            const data = await response.json();
            setUsuarios(data);
        }
        catch (error) {
            console.error('Error fetching usuarios:', error);
        }
    }

    useEffect(() => {
        fetchUsuarios();
    }, []);

    return (
        <>
            <div className="overflow-x-auto">
                <Table hoverable className="text-center">
                    <TableHead>
                        <TableRow>
                            <TableHeadCell>Usuario</TableHeadCell>
                            <TableHeadCell className="max-xl:hidden">Correo</TableHeadCell>
                            <TableHeadCell className="max-xl:hidden">Nombre</TableHeadCell>
                            <TableHeadCell className="max-xl:hidden">Apellido</TableHeadCell>
                            <TableHeadCell className="max-sm:hidden">Rol</TableHeadCell>
                            <TableHeadCell>Editar</TableHeadCell>
                            <TableHeadCell>Eliminar</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y">

                        {usuarios.map((usuario) => (
                            <TableRow key={usuario.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {usuario.usuario}
                                </TableCell>
                                <TableCell className="max-xl:hidden">{usuario.email}</TableCell>
                                <TableCell className="max-xl:hidden">{usuario.nombre}</TableCell>
                                <TableCell className="max-xl:hidden">{usuario.apellido}</TableCell>
                                <TableCell className="max-sm:hidden">{usuario.rol}</TableCell>
                                <TableCell>
                                    <HiOutlinePencilAlt href="#" size={25} className="cursor-pointer text-gray-500 hover:text-gray-700 mx-auto" />
                                </TableCell>
                                <TableCell>
                                    <HiOutlineTrash size={25} className="cursor-pointer text-gray-500 hover:text-gray-700 mx-auto"
                                        onClick={() => modalHandler(usuario)}
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
                                ¿Estás seguro de que deseas eliminar el usuario <span className="font-semibold">{usuario.usuario}</span>?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button onClick={() => aceptarModal()}>
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
        </>
    )
}

export default TableUsuarios