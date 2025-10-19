import React from 'react'
import { Dropdown, DropdownItem } from "flowbite-react";

const Diente = ({ numero, superficies, onCaraClick }) => {

    const disabled = false;

    const menuOpciones = [
        { id: 'restosRadiculares', label: 'Restos Radiculares', texto: 'RR', color: 'red' },
        { id: 'exodoncia', label: 'Exodoncia', texto: 'X', color: 'red' },
        { id: 'exodonciaOrtodoncia', label: 'Exodoncia por Ortodoncia', texto: 'ORT', color: 'grreden' },
        { id: 'endodoncia', label: 'Endodoncia', texto: 'E', color: 'red' },
        { id: 'implante', label: 'Implante', texto: 'IMP', color: 'red' },
        { id: 'fractura', label: 'Fractura', texto: 'FR', color: 'red' },
        { id: 'ausenciaNatural', label: 'Ausencia Natural', texto: 'X' , color: 'black' },
        { id: 'implanteRealizado', label: 'Implante Realizado', texto: 'IMP', color: 'blue' },
        { id: 'exodonciaRealizada', label: 'Exodoncia Realizada', texto: 'X', color: 'blue' },
        { id: 'endodonciaRealizada', label: 'Endodoncia Realizada', texto: 'E', color: 'blue' },
        { id: 'implanteCoronarealizada', label: 'Implante con Corona Permanente', texto: 'IMP', color: 'blue' },
        { id: 'extruido', label: 'Diente Extruido', texto: '⬆', color: 'blue' },
        { id: 'entruido', label: 'Diente Entruido', texto: '⬇', color: 'blue' },
    ]

    const handleClick = (superficie, event) => {
        if(onCaraClick) {
            onCaraClick(numero, superficie, event);
            console.log(`Diente ${numero}, Superficie: ${superficie}`);
        }
    }

    return (
        <div className="border border-gray-400 rounded p-2 m-2 text-center flex flex-col items-center gap-2">
            <svg viewBox="0 0 100 100" width="100" height="100" className="m-2">
                {/* Vestibular (parte superior) */}
                <polygon
                    points="0,0 100,0 75,25 25,25"
                    className={superficies?.vestibular || "fill-white stroke-gray-400 cursor-pointer pointer-events-auto hover:fill-gray-200"}
                    onClick={(e) => handleClick('vestibular', e)}
                />

                {/* Distal (lado izquierdo) */}
                <polygon
                    points="0,0 25,25 25,75 0,100"
                    className={superficies?.distal || "fill-white stroke-gray-400 cursor-pointer pointer-events-auto hover:fill-gray-200"}
                    onClick={(e) => handleClick('distal', e)}
                />

                {/* Mesial (lado derecho) */}
                <polygon
                    points="75,25 100,0 100,100 75,75"
                    className={superficies?.mesial || "fill-white stroke-gray-400 cursor-pointer pointer-events-auto hover:fill-gray-200"}
                    onClick={(e) => handleClick('mesial', e)}
                />

                {/* Oclusal (centro) */}
                <polygon
                    points="25,25 75,25 75,75 25,75"
                    className={superficies?.oclusal || "fill-white stroke-gray-400 cursor-pointer pointer-events-auto hover:fill-gray-200"}
                    onClick={(e) => handleClick('oclusal', e)}
                />

                {/* Palatino (parte inferior) */}
                <polygon
                    points="25,75 75,75 100,100 0,100"
                    className={superficies?.palatino || "fill-white stroke-gray-400 cursor-pointer pointer-events-auto hover:fill-gray-200"}
                    onClick={(e) => handleClick('palatino', e)}
                />
            </svg>
            {/* Número del diente */}

            <Dropdown label="" size="lg" renderTrigger={() => 
                <span className="cursor-pointer pointer-events-auto dark:text-white">
                    Estado
                </span>
                }>
                {menuOpciones.map(opcion => (
                    <DropdownItem key={opcion.id} color={opcion.color}>
                        {opcion.texto} - {opcion.label}
                    </DropdownItem>
                ))}
            </Dropdown>
            
            <div className="text-center font-bold dark:text-white">{numero}</div>
        </div>
    )
}

export default Diente