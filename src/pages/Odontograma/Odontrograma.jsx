import React, { useState, useEffect, useRef } from 'react'
import Navegacion from '../Common/Navegacion'
import Diente from './Diente'
import MenuDiente from './MenuDiente'

const Odontrograma = () => {
    const contenedorRef = useRef(null);

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


    // Distribución por filas (izquierda→derecha), con separación en la línea media
    const LAYOUT = [
        // Superior permanente
        { left: [18,17,16,15,14,13,12,11], right: [21,22,23,24,25,26,27,28] },
        // Superior temporal
        { left: [55,54,53,52,51],          right: [61,62,63,64,65] },
        // Inferior temporal
        { left: [85,84,83,82,81],          right: [71,72,73,74,75] },
        // Inferior permanente
        { left: [48,47,46,45,44,43,42,41], right: [31,32,33,34,35,36,37,38] },
    ];

    // Inicializa TODAS las piezas del layout
    useEffect(() => {
        const allNumbers = LAYOUT.flatMap(r => [...r.left, ...r.right]);
        const dientesIniciales = allNumbers.map((n) => ({
            numero: n,
            superficies: {
                oclusal: '',
                mesial: '',
                distal: '',
                lingual: '',
                vestibular: '',
            },
        }));
        setDientes(dientesIniciales);
    }, []);

    useEffect(() => {
        if (menuState.visible) {
            window.addEventListener('click', handleMenuClose);
        }
        return () => {
            window.removeEventListener('click', handleMenuClose);
        };
    }, [menuState.visible]);

    // Tamaño de diente responsive
    const [toothSize, setToothSize] = useState(48);
    useEffect(() => {
        if (!contenedorRef.current) return;
        const observer = new ResizeObserver(([entry]) => {
            const width = entry.contentRect.width;
            let size = 60;
            if (width < 420) size = 32;
            else if (width < 520) size = 36;
            else if (width < 680) size = 40;
            else if (width < 860) size = 48;
            else if (width < 1040) size = 56;
            setToothSize(size);
        });
        observer.observe(contenedorRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <Navegacion>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4 dark:text-white">Odontograma Interactivo</h1>

                {/* Filas del odontograma con separación en línea media */}
                <div className="space-y-4">
                    {LAYOUT.map((row, idx) => (
                        <div key={idx} className="flex items-end justify-center gap-2">
                            {row.left.map((num) => {
                                const d = dientes.find(x => x.numero === num);
                                return (
                                    <Diente
                                        key={num}
                                        numero={num}
                                        superficies={d?.superficies}
                                        onCaraClick={handleCaraClick}
                                        limpiarDiente={limpiarDiente}
                                        size={48}
                                    />
                                );
                            })}

                            {/* Espaciador para la línea media */}
                            <div className="w-6 sm:w-10" />

                            {row.right.map((num) => {
                                const d = dientes.find(x => x.numero === num);
                                return (
                                    <Diente
                                        key={num}
                                        numero={num}
                                        superficies={d?.superficies}
                                        onCaraClick={handleCaraClick}
                                        limpiarDiente={limpiarDiente}
                                        size={48}
                                    />
                                );
                            })}
                        </div>
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