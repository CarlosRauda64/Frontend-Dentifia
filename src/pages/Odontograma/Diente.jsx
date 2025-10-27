import React from 'react'

const Diente = ({ numero, superficies, onCaraClick, limpiarDiente, size, estado: estadoProp = 'Normal', estadoNombre: estadoNombreProp = '', color: colorProp = '' }) => {

    const [disabled, setDisabled] = React.useState(false);
    const [estado, setEstado] = React.useState(estadoProp || 'Normal');
    const [estadoNombre, setEstadoNombre] = React.useState(estadoNombreProp || '');
    const [color, setColor] = React.useState(colorProp || '');

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

    React.useEffect(() => {
        setEstado(estadoProp || 'Normal');
        setEstadoNombre(estadoNombreProp || '');
        setColor(colorProp || '');
        setDisabled(Boolean(estadoNombreProp));
    }, [estadoProp, estadoNombreProp, colorProp]);

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

    const handleClick = (event) => {
        if (onCaraClick) {
            onCaraClick(numero, event);
        }
    }

    return (
        <div className="border border-gray-400 rounded p-1 m-1 text-center flex flex-col items-center gap-1 bg-gray-50 dark:bg-gray-800 shadow-md">
            <svg viewBox="0 0 100 100" width={size} height={size} className="m-1">
                {/* Vestibular (parte superior) */}
                <polygon
                    points="0,0 100,0 75,25 25,25"
                    className={superficies?.vestibular || "fill-white stroke-gray-400 cursor-pointer pointer-events-auto hover:fill-gray-200"}
                />              

                {/* Distal (lado izquierdo) */}
                <polygon
                    points="0,0 25,25 25,75 0,100"
                    className={superficies?.distal || "fill-white stroke-gray-400 cursor-pointer pointer-events-auto hover:fill-gray-200"}
                />

                {/* Mesial (lado derecho) */}
                <polygon
                    points="75,25 100,0 100,100 75,75"
                    className={superficies?.mesial || "fill-white stroke-gray-400 cursor-pointer pointer-events-auto hover:fill-gray-200"}
                />

                {/* Oclusal (centro) */}
                <polygon
                    points="25,25 75,25 75,75 25,75"
                    className={superficies?.oclusal || "fill-white stroke-gray-400 cursor-pointer pointer-events-auto hover:fill-gray-200"}
                />

                {/* Palatino (parte inferior) */}
                <polygon
                    points="25,75 75,75 100,100 0,100"
                    className={superficies?.palatino || "fill-white stroke-gray-400 cursor-pointer pointer-events-auto hover:fill-gray-200"}
                />
                {disenoEstado(estadoNombre, estado)}
                <polygon
                    points="0,0 0,100 100,100 100,0"
                    className='fill-transparent'
                    onClick={(e) => handleClick(e)}
                />
            </svg>

            <div className="text-center font-bold dark:text-white text-sm">{numero}</div>
            <div className={estado === 'Normal' ? 'text-center font-bold dark:text-white text-sm' : `text-center font-bold text-${color}-600 text-sm`}>{estado}</div>

        </div>
    )
}

export default Diente