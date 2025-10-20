import React from 'react'
import { Dropdown, DropdownItem } from "flowbite-react";

const Diente = ({ numero, superficies, onCaraClick, limpiarDiente, size = 64 }) => {

    const [disabled, setDisabled] = React.useState(false);
    const [estado, setEstado] = React.useState('Normal');
    const [estadoNombre, setEstadoNombre] = React.useState('');
    const [color, setColor] = React.useState('');

    const menuOpciones = [
        { id: 'restosRadiculares', label: 'Restos Radiculares', texto: 'RR', color: 'red' },
        { id: 'exodoncia', label: 'Exodoncia', texto: 'X', color: 'red' },
        { id: 'exodonciaOrtodoncia', label: 'Exodoncia por Ortodoncia', texto: 'ORT', color: 'red' },
        { id: 'endodoncia', label: 'Endodoncia', texto: 'E', color: 'red' },
        { id: 'implante', label: 'Implante', texto: 'IMP', color: 'red' },
        { id: 'fractura', label: 'Fractura', texto: 'FR', color: 'red' },
        { id: 'ausenciaNatural', label: 'Ausencia Natural', texto: 'X', color: 'gray' },
        { id: 'implanteRealizado', label: 'Implante Realizado', texto: 'IMP', color: 'blue' },
        { id: 'exodonciaRealizada', label: 'Exodoncia Realizada', texto: 'X', color: 'blue' },
        { id: 'endodonciaRealizada', label: 'Endodoncia Realizada', texto: 'E', color: 'blue' },
        { id: 'implanteCoronarealizada', label: 'Implante con Corona Permanente', texto: 'IMP', color: 'blue' },
        { id: 'extruido', label: 'Diente Extruido', texto: '⬆', color: 'blue' },
        { id: 'entruido', label: 'Diente Entruido', texto: '⬇', color: 'blue' },
        { id: 'limpiar', label: 'Limpiar Estado', texto: 'Normal', color: '' },
    ]

    const handleClickDropdown = (opcion) => {
        limpiarDiente(numero);
        if (opcion.id === 'limpiar') {
            setDisabled(false);
            setEstado('Normal');
            setEstadoNombre('');
            setColor('');
        } else {
            setEstado(opcion.texto);
            setDisabled(true);
            setColor(opcion.color);
            setEstadoNombre(opcion.id);
        }
    }

    const disenoEstado = (estadoNombre, estado) => {
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
                const r = 45;                 // radio del círculo
                const imgSize = r * 2;        // imagen cuadrada que cubre el círculo
                return (
                    <g className="pointer-events-none">
                        <defs>
                            <clipPath id={`clip-implante-${numero}`}>
                                <circle cx="50" cy="50" r={r} />
                            </clipPath>
                        </defs>

                        {/* borde del círculo */}
                        <circle
                            cx="50"
                            cy="50"
                            r={r}
                            fill="white"
                            stroke={color || '#64748b'}
                            strokeWidth="7"
                        />

                        {/* imagen recortada por el círculo */}
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

    const handleClick = (superficie, event) => {
        if (disabled) {
            event.stopPropagation();
            console.log(`Diente ${numero} está deshabilitado para cambios.`);
            return;
        }
        if (onCaraClick) {
            onCaraClick(numero, superficie, event);
            console.log(`Diente ${numero}, Superficie: ${superficie}`);
        }
    }

    return (
        <div className="border border-gray-400 rounded p-1 m-1 text-center flex flex-col items-center gap-1">
            <svg viewBox="0 0 100 100" width={size} height={size} className="m-1">
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
                {disenoEstado(estadoNombre, estado)}
            </svg>

            <div className="text-center font-bold dark:text-white text-sm">{numero}</div>

            <Dropdown
                label=""
                size="lg"
                className="z-50"
                renderTrigger={() =>
                    <span className={
                        color ? `cursor-pointer pointer-events-auto dark:text-${color}-400 text-${color}-500` :
                            `cursor-pointer pointer-events-auto dark:text-white`
                    }>
                        {estado}
                    </span>
                }
            >
                <div className="max-h-56 overflow-y-auto">
                    {menuOpciones.map(opcion => (
                        <DropdownItem
                            key={opcion.id}
                            color={opcion.color}
                            onClick={() => handleClickDropdown(opcion)}
                        >
                            <span className={`text-${opcion.color}-500`}>{opcion.texto}</span>
                            -
                            <span>{opcion.label}</span>
                        </DropdownItem>
                    ))}
                </div>
            </Dropdown>
        </div>
    )
}

export default Diente