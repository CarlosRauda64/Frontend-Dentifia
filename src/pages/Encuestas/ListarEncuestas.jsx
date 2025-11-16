import { useState } from 'react';
import TableEncuestas from './TableEncuestas';
import Navegacion from '../Common/Navegacion';
import { Button, TextInput, Alert } from 'flowbite-react';
import { HiSearch, HiClipboardCheck, HiCalendar, HiLink, HiExternalLink } from 'react-icons/hi';

const ListarEncuestas = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [desdeFilter, setDesdeFilter] = useState('');
    const [hastaFilter, setHastaFilter] = useState('');
    const [linkCopiado, setLinkCopiado] = useState(false);
    
    const linkEncuesta = `${window.location.origin}/encuesta`;
    
    const copiarLink = () => {
        navigator.clipboard.writeText(linkEncuesta);
        setLinkCopiado(true);
        setTimeout(() => setLinkCopiado(false), 3000);
    };

    return (
        <Navegacion>
            <div className="p-4 max-sm:pt-20 max-sm:px-2">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                    <h1 className="text-2xl font-bold dark:text-gray-200">Consultar Encuestas de Satisfacción</h1>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <TextInput
                            id="search"
                            type="text"
                            icon={HiSearch}
                            placeholder="Buscar por observaciones..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-auto"
                        />
                    </div>
                </div>
                
                {/* Sección de Link Público */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg shadow p-4 mb-4">
                    <h3 className="text-lg font-semibold mb-3 dark:text-gray-200 flex items-center gap-2">
                        <HiLink className="h-5 w-5" />
                        Link de Encuesta Pública
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Comparta este enlace con los pacientes para que puedan llenar la encuesta de satisfacción.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                        <TextInput
                            type="text"
                            value={linkEncuesta}
                            readOnly
                            className="flex-1 bg-white dark:bg-gray-700"
                        />
                        <div className="flex gap-2">
                            <Button 
                                onClick={copiarLink}
                                color={linkCopiado ? "success" : "blue"}
                                className="whitespace-nowrap"
                            >
                                {linkCopiado ? (
                                    <>
                                        <HiClipboardCheck className="mr-2 h-4 w-4" />
                                        ¡Copiado!
                                    </>
                                ) : (
                                    <>
                                        <HiClipboardCheck className="mr-2 h-4 w-4" />
                                        Copiar Link
                                    </>
                                )}
                            </Button>
                            <Button 
                                href="/encuesta"
                                target="_blank"
                                color="gray"
                                className="whitespace-nowrap"
                            >
                                <HiExternalLink className="mr-2 h-4 w-4" />
                                Ver Encuesta
                            </Button>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
                    <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">Filtros por Fecha</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Desde</label>
                            <TextInput
                                type="date"
                                icon={HiCalendar}
                                value={desdeFilter}
                                onChange={(e) => setDesdeFilter(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Hasta</label>
                            <TextInput
                                type="date"
                                icon={HiCalendar}
                                value={hastaFilter}
                                onChange={(e) => setHastaFilter(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                
                <TableEncuestas searchTerm={searchTerm} desdeFilter={desdeFilter} hastaFilter={hastaFilter} />
            </div>
        </Navegacion>
    );
};

export default ListarEncuestas;

