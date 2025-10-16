import React from 'react'

const MenuDiente = ({ posicion, seleccionOpcion, cerrar }) => {

    const menuOpciones = [
        { id: 'caries', label: 'Marcar Caries', colorClass: 'fill-red-400' },
        { id: 'restauracion', label: 'Añadir Restauración', colorClass: 'fill-blue-400' },
        { id: 'sellante', label: 'Añadir Sellante', colorClass: 'fill-green-400' },
        { id: 'limpiar', label: 'Limpiar Superficie', colorClass: '' },
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
            className="bg-white border border-gray-300 rounded-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
        >
            <ul>
                {menuOpciones.map((opcion) => (
                    <li
                        key={opcion.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleOpcionClick(opcion)}
                    >
                        {opcion.label}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default MenuDiente