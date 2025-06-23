import TableInsumos from './TableInsumos'
import Navegacion from '../Common/Navegacion'
import { Button } from 'flowbite-react'

const ListarInsumos = () => {
    return (
        <Navegacion>
            <div className="p-4 max-sm:pt-20 max-sm:px-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold mb-4 dark:text-gray-200">Gestión de Insumos</h1>
                    <div className="mb-4">
                        <Button href="/inventario/insumos/nuevo" color="blue">
                            Agregar Insumo
                        </Button>
                    </div>
                </div>
                <TableInsumos />
            </div>
        </Navegacion>
    )
}

export default ListarInsumos