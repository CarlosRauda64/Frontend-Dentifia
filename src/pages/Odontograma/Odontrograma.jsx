import React, { useState, useEffect, useRef } from 'react'
import Navegacion from '../Common/Navegacion'
import Diente from './Diente'
import ModalDiente from './ModalDiente'
import { Label, Textarea } from "flowbite-react";

const Odontrograma = () => {
    const contenedorRef = useRef(null);

    const [dientes, setDientes] = useState([]);

    const [modalState, setModalState] = useState({
        visible: false,
        selectedInfo: null
    });

    const handleCaraClick = (numero, event) => {
        event.stopPropagation();
        console.log(`Posicion del clic: (${event.clientX}, ${event.clientY})`);
        console.log(dientes.find(d => d.numero === numero))
        setModalState({
            visible: true,
            selectedInfo: { numero }
        });
    }

    const handleModalClose = () => {
        setModalState({
            visible: false,
            selectedInfo: null
        });
    }

    const handleModalSave = ({ numero, superficies, comentario, globalAction }) => {
        setDientes(prevDientes => {
            const nuevosDientes = [...prevDientes];
            const index = nuevosDientes.findIndex(d => d.numero === numero);
            if (index !== -1) {
                nuevosDientes[index] = {
                    ...nuevosDientes[index],
                    superficies: superficies,
                    // aplicar acción global si existe
                    estado: globalAction ? (globalAction.texto || globalAction.label || nuevosDientes[index].estado) : nuevosDientes[index].estado,
                    estadoNombre: globalAction ? globalAction.id : nuevosDientes[index].estadoNombre,
                    color: globalAction ? (globalAction.color || '') : nuevosDientes[index].color,
                };
            }
            return nuevosDientes;
        });
        console.log(`Guardado diente ${numero}`, superficies, comentario, globalAction);
        handleModalClose();
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
                    palatino: '',
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
        { left: [18, 17, 16, 15, 14, 13, 12, 11], right: [21, 22, 23, 24, 25, 26, 27, 28] },
        // Superior temporal
        { left: [55, 54, 53, 52, 51], right: [61, 62, 63, 64, 65] },
        // Inferior temporal
        { left: [85, 84, 83, 82, 81], right: [71, 72, 73, 74, 75] },
        // Inferior permanente
        { left: [48, 47, 46, 45, 44, 43, 42, 41], right: [31, 32, 33, 34, 35, 36, 37, 38] },
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
                palatino: '',
                vestibular: '',
            },
            // estado global del diente (para exodoncia, implante, etc.)
            estado: 'Normal',
            estadoNombre: '',
            color: '',
        }));
        setDientes(dientesIniciales);
    }, []);

    // No global click listener needed: Modal handles its own close logic.
    useEffect(() => {}, []);

    return (

        <div className="p-4 w-full">
            {/* Filas del odontograma con separación en línea media */}
            <div className="space-y-4">
                {LAYOUT.map((row, idx) => (
                    <div key={idx} className="flex justify-center items-center px-4">
                        <div className="flex flex-wrap justify-center items-center">
                            {row.left.map((num) => {
                                const d = dientes.find(x => x.numero === num);
                                return (
                                    <Diente
                                        key={num}
                                        numero={num}
                                        superficies={d?.superficies}
                                        estado={d?.estado}
                                        estadoNombre={d?.estadoNombre}
                                        color={d?.color}
                                        onCaraClick={handleCaraClick}
                                        limpiarDiente={limpiarDiente}
                                        size={40}
                                    />
                                );
                            })}
                        </div>

                        {/* Espaciador para la línea media */}
                        <div className="w-6 sm:w-10 flex-none" />

                        <div className="flex flex-wrap justify-center items-center">
                            {row.right.map((num) => {
                                const d = dientes.find(x => x.numero === num);
                                return (
                                    <Diente
                                        key={num}
                                        numero={num}
                                        superficies={d?.superficies}
                                        estado={d?.estado}
                                        estadoNombre={d?.estadoNombre}
                                        color={d?.color}
                                        onCaraClick={handleCaraClick}
                                        limpiarDiente={limpiarDiente}
                                        size={40}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {modalState.visible && (
                <ModalDiente
                    visible={modalState.visible}
                    diente={dientes.find(d => d.numero === modalState.selectedInfo?.numero)}
                    onSave={handleModalSave}
                    onClose={handleModalClose}
                />
            )}

            <div className="w-full my-6 max-w-full px-50">
                <div className="mb-2 block">
                    <Label htmlFor="comment">Comentarios adicionales: </Label>
                </div>
                <Textarea
                    id="comment"
                    placeholder="Insertar comentario..."
                    required
                    rows={4}
                    className='resize-none w-full'
                />
            </div>
        </div>

    )

}

export default Odontrograma