import React from 'react'
import {ListGroup, ListGroupItem} from 'flowbite-react';

const MenuDiente = ({ posicion, seleccionOpcion, cerrar }) => {

    const menuOpciones = [
        { id: 'caries', label: 'Caries', colorClass: 'fill-red-400', color: 'bg-red-500' },
        { id: 'obturacion', label: 'Obturación', colorClass: 'fill-blue-400', color: 'bg-blue-500' },
        { id: 'cariesRadiograficas', label: 'Caries Radiográficas', colorClass: 'fill-green-400', color: 'bg-green-500' },
        { id: 'sellante', label: 'Sellante', colorClass: 'fill-yellow-400', color: 'bg-yellow-500' },
        { id: 'limpiar', label: 'Limpiar Superficie', colorClass: '', color: 'bg-gray-500' },
    ]

    const handleOpcionClick = (opcion) => {
        seleccionOpcion(opcion);
        cerrar();
    }

    const menuStyle = {
        position: 'fixed',
        top: `${posicion.y}px`,
        left: `${posicion.x}px`,
        zIndex: 1000,
    };

    return (
        <div
            style={menuStyle}
            className="flex justify-center"
            onClick={(e) => e.stopPropagation()}
        >
            <ListGroup className="w-48">
                {menuOpciones.map((opcion) => (
                    <ListGroupItem
                        key={opcion.id}
                        className='cursor-pointer'
                        onClick={() => handleOpcionClick(opcion)}
                    >
                        <span className={`w-3 h-3 rounded-full ${opcion.color} mr-2`}></span>
                        {opcion.label}
                    </ListGroupItem>
                ))}
            </ListGroup>
        </div>
    )
}

export default MenuDiente