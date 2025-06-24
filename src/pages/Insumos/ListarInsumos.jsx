import { useState } from 'react';
import TableInsumos from './TableInsumos';
import Navegacion from '../Common/Navegacion';
import { Button, TextInput } from 'flowbite-react';
import { HiSearch } from 'react-icons/hi';

const ListarInsumos = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <Navegacion>
            <div className="p-4 max-sm:pt-20 max-sm:px-2">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                    <h1 className="text-2xl font-bold dark:text-gray-200">Gestión de Insumos</h1>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <TextInput
                            id="search"
                            type="text"
                            icon={HiSearch}
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-auto"
                        />
                        <Button href="/inventario/insumos/nuevo" color="blue">
                            Agregar Insumo
                        </Button>
                    </div>
                </div>
                <TableInsumos searchTerm={searchTerm} />
            </div>
        </Navegacion>
    );
};

export default ListarInsumos;