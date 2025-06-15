import TableUsuarios from './TableUsuarios'
import Navegacion from '../Common/Navegacion'
import { Button } from 'flowbite-react'

const ListarUsuarios = () => {
    return (
        <Navegacion>
            <div className="p-4 max-sm:pt-20 max-sm:px-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold mb-4">Lista de Usuarios</h1>
                    <div className="mb-4">
                        <Button href="#" color="blue">
                            Agregar Usuario
                        </Button>
                    </div>
                </div>
                <TableUsuarios />
            </div>
        </Navegacion>
    )
}

export default ListarUsuarios