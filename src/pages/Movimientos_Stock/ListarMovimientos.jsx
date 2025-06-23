import TableMovimientos from './TableMovimientos'
import Navegacion from '../Common/Navegacion'
import { Button } from 'flowbite-react'

const ListarMovimientos = () => {
    return (
        <Navegacion>
            <div className="p-4 max-sm:pt-20 max-sm:px-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold mb-4 dark:text-gray-600">Registro de movimientos en el stock</h1>
                    <div className="mb-4">
                        <Button href="/inventario/movimientos_stock/nuevo" color="blue">
                            Realizar un movimiento
                        </Button>
                    </div>
                </div>
                <TableMovimientos />
            </div>
        </Navegacion>
    )
}

export default ListarMovimientos