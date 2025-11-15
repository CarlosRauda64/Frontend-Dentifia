import React from 'react'
import { Button } from 'flowbite-react';

const MenuGlobal = () => {

    const menuOpciones = [
        { id: 'restosRadiculares', label: 'Restos Radiculares', texto: 'RR', color: 'red' },
        { id: 'exodoncia', label: 'Exodoncia', texto: 'X', color: 'red' },
        { id: 'exodonciaOrtodoncia', label: 'Exodoncia por Ortodoncia', texto: 'ORT', color: 'red' },
        { id: 'endodoncia', label: 'Endodoncia', texto: 'E', color: 'red' },
        { id: 'implante', label: 'Implante', texto: 'IMP', color: 'red' },
        { id: 'fractura', label: 'Fractura', texto: 'FR', color: 'red' },
        { id: 'ausenciaNatural', label: 'Ausencia Natural', texto: 'X', color: 'dark' },
        { id: 'implanteRealizado', label: 'Implante Realizado', texto: 'IMP', color: 'blue' },
        { id: 'exodonciaRealizada', label: 'Exodoncia Realizada', texto: 'X', color: 'blue' },
        { id: 'endodonciaRealizada', label: 'Endodoncia Realizada', texto: 'E', color: 'blue' },
        { id: 'implanteCoronarealizada', label: 'Implante con Corona Permanente', texto: 'IMP', color: 'blue' },
        { id: 'extruido', label: 'Diente Extruido', texto: '⬆', color: 'blue' },
        { id: 'entruido', label: 'Diente Entruido', texto: '⬇', color: 'blue' },
    ]

    return (
        <div className="w-full px-2 border rounded-2xl border-black p-4 mb-4 dark:border-gray-600">
            <span className="font-semibold dark:text-white">Opciones de Tratamiento: </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {menuOpciones.map((opcion) => (
                    <Button
                        key={opcion.id}
                        color={opcion.color}
                        className="w-full truncate"
                        title={opcion.label}
                    >
                        <span className="font-semibold mr-2">{opcion.texto}</span>
                        <span className="hidden sm:inline truncate">{opcion.label}</span>
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default MenuGlobal