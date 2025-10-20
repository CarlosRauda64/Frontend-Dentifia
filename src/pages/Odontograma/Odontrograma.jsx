import React, { useState, useEffect } from 'react'
import Navegacion from '../Common/Navegacion'
import Diente from './Diente'
import MenuDiente from './MenuDiente'

const Odontrograma = () => {

    const [dientes, setDientes] = useState([]);

    const [menuState, setMenuState] = useState({
        visible: false,
        position: { x: 0, y: 0 },
        selectedInfo: null
    });

    const handleCaraClick = (numero, superficie, event) => {
        event.stopPropagation();
        console.log(`Posicion del clic: (${event.clientX}, ${event.clientY})`);
        setMenuState({
            visible: true,
            position: { x: event.clientX, y: event.clientY },
            selectedInfo: { numero, superficie }
        });
    }

    const handleMenuClose = () => {
        setMenuState({
            visible: false,
            position: { x: 0, y: 0 },
            selectedInfo: null
        });
    }

    const handleMenuAction = (opcion) => {
        const { numero, superficie } = menuState.selectedInfo;

        setDientes(prevDientes => {
            const nuevosDientes = [...prevDientes]
            const index = nuevosDientes.findIndex(d => d.numero === numero);
            if (index !== -1) {
                const dienteActual = nuevosDientes[index];
                const nuevasSuperficies = { ...dienteActual.superficies };
                nuevasSuperficies[superficie] = opcion.colorClass;
                nuevosDientes[index] = {
                    ...dienteActual,
                    superficies: nuevasSuperficies
                };
            }
            return nuevosDientes;
        });


        console.log(`Acción '${opcion.label}' en Diente ${numero}, Superficie: ${superficie}`);
    };

    const limpiarDiente = (numero) => {
        setDientes(prevDientes => {
            const nuevosDientes = [...prevDientes]
            const index = nuevosDientes.findIndex(d => d.numero === numero);
            if (index !== -1) {
                const dienteActual = nuevosDientes[index];
                const nuevasSuperficies = {
                    oclusal: '',
                    mesial: '',
                    distal: '',
                    lingual: '',
                    vestibular: ''
                };
                nuevosDientes[index] = {
                    ...dienteActual,
                    superficies: nuevasSuperficies
                };
            }
            return nuevosDientes;
        });
    }


    useEffect(() => {
        const inicializarDientes = () => {
            const dientesIniciales = [];
            for (let i = 11; i <= 19; i++) {
                dientesIniciales.push({
                    numero: i,
                    superficies: {
                        oclusal: '',
                        mesial: '',
                        distal: '',
                        lingual: '',
                        vestibular: ''
                    }
                });
            }
            setDientes(dientesIniciales);
        };

        inicializarDientes();
    }, []);

    useEffect(() => {
        if (menuState.visible) {
            window.addEventListener('click', handleMenuClose);
        }
        return () => {
            window.removeEventListener('click', handleMenuClose);
        };
    }, [menuState.visible]);

    return (
        <Navegacion>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4 dark:text-white">Odontograma Interactivo</h1>
                <div className="grid grid-cols-4 gap-4">
                    {dientes.map((diente) => (
                        <Diente
                            key={diente.numero}
                            numero={diente.numero}
                            superficies={diente.superficies}
                            onCaraClick={handleCaraClick}
                            limpiarDiente={limpiarDiente}
                        />
                    ))}
                </div>
                {menuState.visible && (
                    <MenuDiente
                        posicion={menuState.position}
                        seleccionOpcion={handleMenuAction}
                        cerrar={handleMenuClose}
                    />
                )}
            </div>
        </Navegacion>
    )

}



export default Odontrograma