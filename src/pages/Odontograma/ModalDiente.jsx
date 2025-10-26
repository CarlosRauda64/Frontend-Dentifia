import React, { useEffect, useState } from 'react'
import { Button, Label, Textarea } from 'flowbite-react'

const ModalDiente = ({ visible, diente, onSave, onClose }) => {
    const [localSuperficies, setLocalSuperficies] = useState({
        oclusal: '',
        mesial: '',
        distal: '',
        lingual: '',
        vestibular: '',
    });
    const [localOpcion, setLocalOpcion] = useState({
        estado: 'Normal',
        estadoNombre: 'limpiarEstado',
    });
    const [selectedTreatment, setSelectedTreatment] = useState(null);
    const [selectedGlobal, setSelectedGlobal] = useState(null);
    const [disabledTreatments, setDisabledTreatments] = useState(false);

    const menuOpciones = [
        { id: 'caries', label: 'Caries', colorClass: 'fill-red-400', color: 'bg-red-500' },
        { id: 'obturacion', label: 'Obturación', colorClass: 'fill-blue-400', color: 'bg-blue-500' },
        { id: 'cariesRadiograficas', label: 'Caries Radiográficas', colorClass: 'fill-green-400', color: 'bg-green-500' },
        { id: 'sellante', label: 'Sellante', colorClass: 'fill-yellow-400', color: 'bg-yellow-500' },
        { id: 'limpiar', label: 'Limpiar Superficie', colorClass: '', color: 'bg-gray-500' },
    ];

    const menuGlobales = [
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
        { id: 'limpiarEstado', label: 'Limpiar Estado', texto: 'Normal', color: '' },
    ];

    useEffect(() => {
        if (diente) {
            if (diente.estado === 'Normal' && diente.estadoNombre === '') {
                setLocalSuperficies({
                    oclusal: diente.superficies?.oclusal || '',
                    mesial: diente.superficies?.mesial || '',
                    distal: diente.superficies?.distal || '',
                    palatino: diente.superficies?.palatino || '',
                    vestibular: diente.superficies?.vestibular || '',
                });
            } else {
                setLocalSuperficies({
                    oclusal: '',
                    mesial: '',
                    distal: '',
                    palatino: '',
                    vestibular: '',
                });
                setLocalOpcion({
                    estado: diente.estado || '',
                    estadoNombre: diente.estadoNombre || '',
                });
                if (diente.estadoNombre === 'limpiarEstado') {
                    setDisabledTreatments(false);
                } else {
                    setDisabledTreatments(true);
                }
            }
        }
    }, [diente]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape' && visible) onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [visible, onClose]);

    useEffect(() => {
        if (selectedGlobal === null) return;
        setLocalSuperficies({
            oclusal: '',
            mesial: '',
            distal: '',
            palatino: '',
            vestibular: '',
        });
    }, [selectedGlobal]);

    if (!visible || !diente) return null;

    const applyTreatmentToSurface = (superficie) => {
        setLocalSuperficies(prev => {
            const copy = { ...prev };
            if (!selectedTreatment || selectedTreatment.id === 'limpiar') {
                copy[superficie] = '';
            } else {
                copy[superficie] = selectedTreatment.colorClass;
            }
            return copy;
        });
    };

    const handleSurfaceClick = (s) => {
        applyTreatmentToSurface(s);
    };

    const handleSave = () => {
        const nuevas = {
            oclusal: localSuperficies.oclusal || '',
            mesial: localSuperficies.mesial || '',
            distal: localSuperficies.distal || '',
            palatino: localSuperficies.palatino || '',
            vestibular: localSuperficies.vestibular || '',
        };
        /* onSave({ numero: diente.numero, superficies: nuevas, globalAction: selectedGlobal }); */
        if (selectedGlobal !== null && selectedGlobal.id !== 'limpiarEstado') {
            const nuevas = {
                oclusal: '',
                mesial: '',
                distal: '',
                palatino: '',
                vestibular: '',
            };
            onSave({ numero: diente.numero, superficies: nuevas, globalAction: selectedGlobal });
        } else {
            onSave({ numero: diente.numero, superficies: nuevas, globalAction: selectedGlobal });
        }
    };

    const overlayStyle = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
    };

    const disenoEstado = (estadoNombre, estado) => {
        const color = menuGlobales.find(op => op.id === estadoNombre)?.color || 'gray';
        const numero = diente.numero;
        switch (estadoNombre) {
            case 'exodoncia':
                return <text
                    x="50"
                    y="64"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`text-${color}-800 dark:text-${color}800 fill-current`}
                    fontSize="140"
                >
                    {estado === 'Normal' ? '' : estado}
                </text>;
            case 'exodonciaOrtodoncia':
                return <text
                    x="50"
                    y="64"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`text-${color}-500 dark:text-${color}-400 fill-current`}
                    fontSize="140"
                >
                    X
                </text>;
            case 'implante':
                return <image href="https://img.icons8.com/?size=100&id=VZE4lkdKnHQr&format=png&color=000000"
                    x={50 - 75 / 2}
                    y={50 - 75 / 2}
                    width={75}
                    height={75} />;
            case 'fractura':
                return <polyline
                    points="-10,62 10,42 30,62 50,42 70,62 90,42 110,62"
                    fill="none"
                    stroke={color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            case 'ausenciaNatural':
                return <text
                    x="50"
                    y="64"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`text-${color}-800 dark:text-${color}800 fill-current`}
                    fontSize="140"
                >
                    {estado === 'Normal' ? '' : estado}
                </text>;
            case 'implanteRealizado':
                return <image href="https://img.icons8.com/?size=100&id=VZE4lkdKnHQr&format=png&color=000000"
                    x={50 - 75 / 2}
                    y={50 - 75 / 2}
                    width={75}
                    height={75} />;
            case 'exodonciaRealizada':
                return <text
                    x="50"
                    y="64"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`text-${color}-800 dark:text-${color}800 fill-current`}
                    fontSize="140"
                >
                    {estado === 'Normal' ? '' : estado}
                </text>;
            case 'implanteCoronarealizada':
                const r = 45;
                const imgSize = r * 2;
                return (
                    <g className="pointer-events-none">
                        <defs>
                            <clipPath id={`clip-implante-${numero}`}>
                                <circle cx="50" cy="50" r={r} />
                            </clipPath>
                        </defs>

                        <circle
                            cx="50"
                            cy="50"
                            r={r}
                            fill="white"
                            stroke={color || '#64748b'}
                            strokeWidth="7"
                        />

                        <image
                            href="https://img.icons8.com/?size=100&id=VZE4lkdKnHQr&format=png&color=000000"
                            x={50 - imgSize / 2}
                            y={50 - imgSize / 2}
                            width={imgSize}
                            height={imgSize}
                            preserveAspectRatio="xMidYMid slice"
                            clipPath={`url(#clip-implante-${numero})`}
                        />
                    </g>
                );
            case 'extruido':
                return <text></text>;
            case 'entruido':
                return <text></text>;
            default:
                return <text
                    x="50"
                    y="55"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`text-${color}-700 dark:text-${color}-700 fill-current font-bold`}
                    fontSize="60"
                >
                    {estado === 'Normal' ? '' : estado}
                </text>;
        }
    }

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-11/12 md:w-3/4 lg:w-1/2 shadow-lg" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 flex flex-col items-center">
                        <div className="text-2xl font-semibold mb-2 dark:text-white">Diente {diente.numero}</div>
                        <svg viewBox="0 0 100 100" width={240} height={240} className="m-1">
                            <polygon
                                points="0,0 100,0 75,25 25,25"
                                className={localSuperficies.vestibular || "fill-white stroke-gray-400 cursor-pointer hover:fill-gray-200 strokeWidth-3"}
                                onClick={() => handleSurfaceClick('vestibular')}
                            />
                            <polygon
                                points="0,0 25,25 25,75 0,100"
                                className={localSuperficies.distal || "fill-white stroke-gray-400 cursor-pointer hover:fill-gray-200 strokeWidth-3"}
                                onClick={() => handleSurfaceClick('distal')}
                            />
                            <polygon
                                points="75,25 100,0 100,100 75,75"
                                className={localSuperficies.mesial || "fill-white stroke-gray-400 cursor-pointer hover:fill-gray-200 strokeWidth-3"}
                                onClick={() => handleSurfaceClick('mesial')}
                            />
                            <polygon
                                points="25,25 75,25 75,75 25,75"
                                className={localSuperficies.oclusal || "fill-white stroke-gray-400 cursor-pointer hover:fill-gray-200 strokeWidth-3"}
                                onClick={() => handleSurfaceClick('oclusal')}
                            />
                            <polygon
                                points="25,75 75,75 100,100 0,100"
                                className={localSuperficies.palatino || "fill-white stroke-gray-400 cursor-pointer hover:fill-gray-200 strokeWidth-3"}
                                onClick={() => handleSurfaceClick('palatino')}
                            />
                            {disenoEstado(localOpcion.estadoNombre, localOpcion.estado)}
                        </svg>
                        <p className="text-2xl font-semibold dark:text-white">{diente.numero}</p>
                    </div>

                    <div className="flex-1">
                        <div className="mb-2 font-semibold dark:text-white">Opciones</div>
                        <div className="mb-2">
                            <div className="mb-1">Tratamientos por superficie</div>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {menuOpciones.map(op => (
                                    <button
                                        key={op.id}
                                        onClick={() => { setSelectedTreatment(op) }}
                                        disabled={disabledTreatments}
                                        className={
                                            !disabledTreatments ? 
                                            `p-2 rounded ${selectedTreatment?.id === op.id ? 'ring-2 ring-offset-1' : ''} ${op.color}` 
                                            : `p-2 rounded ${op.color} opacity-50 cursor-not-allowed`
                                        }>
                                        {op.label}
                                    </button>
                                ))}
                            </div>

                            <div className="mb-1">Acciones globales del diente</div>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {menuGlobales.map(op => (
                                    <button
                                        key={op.id}
                                        onClick={(e) => {
                                            setSelectedGlobal(op)
                                            setSelectedTreatment(null)
                                            document.activeElement?.blur();
                                            setLocalOpcion({ estado: op.texto, estadoNombre: op.id })
                                            op.id === 'limpiarEstado' ? setDisabledTreatments(false) : setDisabledTreatments(true)
                                        }}

                                        aria-pressed={selectedGlobal?.id === op.id}
                                        className={`p-2 rounded ${selectedGlobal?.id === op.id ? 'ring-2 ring-offset-1' : ''} ${op.color === 'dark' ? 'bg-gray-700 text-white' : op.color === 'red' ? 'bg-red-500 text-white' : op.color === 'blue' ? 'bg-blue-500 text-white' : ''}`}
                                    >
                                        <span className="font-semibold mr-2">{op.texto || ''}</span>
                                        <span className="truncate">{op.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4 justify-end">
                            <Button color="gray" onClick={onClose}>Cancelar</Button>
                            <Button onClick={handleSave}>Guardar</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalDiente
