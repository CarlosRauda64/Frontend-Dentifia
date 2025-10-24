import TableEncuestas from './TableEncuestas'
import Navegacion from '../Common/Navegacion'
import { Button } from 'flowbite-react'

const ListarEncuestas = () => {
    return (
        <Navegacion>
            <div className="p-4 max-sm:pt-20 max-sm:px-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold mb-4 dark:text-gray-600">Registro de encuestas</h1>
                    
                </div>
                <TableEncuestas />
            </div>
        </Navegacion>
    )
}

export default ListarEncuestas