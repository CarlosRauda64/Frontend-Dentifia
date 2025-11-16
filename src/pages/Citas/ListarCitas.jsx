import { useState } from 'react';
import TableCitas from './TableCitas';
import Navegacion from '../Common/Navegacion';
import { Button, TextInput, Select } from 'flowbite-react';
import { HiSearch, HiCalendar } from 'react-icons/hi';

const ListarCitas = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');

    return (
        <Navegacion>
            <div className="p-4 max-sm:pt-20 max-sm:px-2">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                    <h1 className="text-2xl font-bold dark:text-gray-200">Gestión de Citas</h1>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <TextInput
                            id="search"
                            type="text"
                            icon={HiSearch}
                            placeholder="Buscar por paciente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-auto"
                        />
                        <Select
                            value={estadoFilter}
                            onChange={(e) => setEstadoFilter(e.target.value)}
                            className="w-full sm:w-auto"
                        >
                            <option value="">Todos los estados</option>
                            <option value="programada">Programada</option>
                            <option value="atendida">Atendida</option>
                            <option value="cancelada">Cancelada</option>
                            <option value="reprogramada">Reprogramada</option>
                            <option value="no_asistio">No Asistió</option>
                        </Select>
                        <Button href="/citas/nuevo" color="blue">
                            <HiCalendar className="mr-2 h-4 w-4" />
                            Nueva Cita
                        </Button>
                    </div>
                </div>
                <TableCitas searchTerm={searchTerm} estadoFilter={estadoFilter} />
            </div>
        </Navegacion>
    );
};

export default ListarCitas;

