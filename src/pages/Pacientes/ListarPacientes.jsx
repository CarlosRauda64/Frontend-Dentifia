import { useState } from 'react';
import TablePacientes from './TablePacientes';
import Navegacion from '../Common/Navegacion';
import { Button, TextInput } from 'flowbite-react';
import { HiSearch } from 'react-icons/hi';

const ListarPacientes = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <Navegacion>
            <div className="p-4 max-sm:pt-20 max-sm:px-2">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                    <h1 className="text-2xl font-bold dark:text-gray-200">Gestión de Pacientes</h1>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <TextInput
                            id="search"
                            type="text"
                            icon={HiSearch}
                            placeholder="Buscar por nombre, DUI o teléfono..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-auto"
                        />
                        <Button href="/pacientes/nuevo" color="blue">
                            Agregar Paciente
                        </Button>
                    </div>
                </div>
                <TablePacientes searchTerm={searchTerm} />
            </div>
        </Navegacion>
    );
};

export default ListarPacientes;
