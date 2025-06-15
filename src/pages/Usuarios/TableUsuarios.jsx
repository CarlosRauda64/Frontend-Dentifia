import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useAuth } from "../../auth/useAuth";
import { API_URL } from '../../api/api';

const TableUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
    const auth = useAuth();
    const fetchUsuarios = async () => {
        try {
            const response = await fetch(`${API_URL}/usuarios/listar_usuarios`, {
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
        <div className="overflow-x-auto">
            <Table hoverable>
                <TableHead>
                    <TableRow>
                        <TableHeadCell>Usuario</TableHeadCell>
                        <TableHeadCell className="max-sm:hidden">Correo</TableHeadCell>
                        <TableHeadCell className="max-sm:hidden">Nombre</TableHeadCell>
                        <TableHeadCell className="max-sm:hidden">Apellido</TableHeadCell>
                        <TableHeadCell className="max-sm:hidden">Rol</TableHeadCell>
                        <TableHeadCell>
                            <span className="sr-only">Edit</span>
                        </TableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                    
                    {usuarios.map((usuario) => (
                        <TableRow key={usuario.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {usuario.nombre}
                            </TableCell>
                            <TableCell className="max-sm:hidden">{usuario.email}</TableCell>
                            <TableCell className="max-sm:hidden">{usuario.nombre}</TableCell>
                            <TableCell className="max-sm:hidden">{usuario.apellido}</TableCell>
                            <TableCell className="max-sm:hidden">{usuario.rol}</TableCell>
                            <TableCell>
                                <a href='#' className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                                    Editar
                                </a>
                            </TableCell>
                        </TableRow>
                    ))}
                    
                </TableBody>
            </Table>
        </div>
    )
}

export default TableUsuarios