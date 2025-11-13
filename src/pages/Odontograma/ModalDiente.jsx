import React, { useEffect, useMemo, useState } from 'react'
import { Button } from 'flowbite-react'

const createEmptySurfaces = () => ({
    oclusal: null,
    mesial: null,
    distal: null,
    palatino: null,
    vestibular: null
})

const ModalDiente = ({ visible, diente, onSave, onClose, surfaceOptions = [], globalOptions = [] }) => {
    const [localSuperficies, setLocalSuperficies] = useState(createEmptySurfaces())
    const [selectedTreatment, setSelectedTreatment] = useState(null)
    const [selectedGlobalId, setSelectedGlobalId] = useState(null)

    const surfaceClassMap = useMemo(() => {
        const map = {}
        surfaceOptions.forEach((option) => {
            map[option.id] = option.colorClass || ''
        })
        return map
    }, [surfaceOptions])

    const globalOptionMap = useMemo(() => {
        const map = {}
        globalOptions.forEach((option) => {
            map[option.id] = option
        })
        return map
    }, [globalOptions])

    const surfaceSelectionDisabled = Boolean(selectedGlobalId && selectedGlobalId !== 'limpiarEstado')

    useEffect(() => {
        if (!visible || !diente) return

        setLocalSuperficies({
            oclusal: diente.superficies?.oclusal ?? null,
            mesial: diente.superficies?.mesial ?? null,
            distal: diente.superficies?.distal ?? null,
            palatino: diente.superficies?.palatino ?? null,
            vestibular: diente.superficies?.vestibular ?? null
        })
        setSelectedTreatment(null)
        setSelectedGlobalId(diente.globalConditionId ?? null)
    }, [visible, diente])

    useEffect(() => {
        if (!surfaceSelectionDisabled) return
        setLocalSuperficies(createEmptySurfaces())
    }, [surfaceSelectionDisabled])

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape' && visible) onClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [visible, onClose])

    if (!visible || !diente) return null

    const applyTreatmentToSurface = (surfaceKey) => {
        if (surfaceSelectionDisabled) return

        setLocalSuperficies((prev) => {
            const copy = { ...prev }
            if (!selectedTreatment || selectedTreatment.id === 'limpiar') {
                copy[surfaceKey] = null
            } else {
                copy[surfaceKey] = selectedTreatment.id
            }
            return copy
        })
    }

    const handleSurfaceClick = (surfaceKey) => {
        applyTreatmentToSurface(surfaceKey)
    }

    const handleGlobalSelect = (option) => {
        setSelectedGlobalId(option.id)
        setSelectedTreatment(null)
    }

    const handleSave = () => {
        const normalizedSuperficies = {
            ...createEmptySurfaces(),
            ...localSuperficies
        }

        const storedGlobalId = selectedGlobalId && selectedGlobalId !== 'limpiarEstado'
            ? selectedGlobalId
            : null

        if (storedGlobalId) {
            Object.keys(normalizedSuperficies).forEach((key) => {
                normalizedSuperficies[key] = null
            })
        }

        onSave({
            numero: diente.numero,
            superficies: normalizedSuperficies,
            globalConditionId: storedGlobalId
        })
    }

    const getPolygonClass = (key) => {
        const condicion = localSuperficies[key]
        const fillClass = condicion ? (surfaceClassMap[condicion] || 'fill-blue-300') : 'fill-white'
        if (surfaceSelectionDisabled) {
            return `${fillClass} stroke-gray-400 opacity-60 cursor-not-allowed`
        }
        return `${fillClass} stroke-gray-400 cursor-pointer hover:fill-gray-200`
    }

    const selectedGlobalOption = selectedGlobalId ? globalOptionMap[selectedGlobalId] : null
    const displayedEstadoNombre = selectedGlobalOption?.id ?? ''
    const displayedEstado = selectedGlobalOption?.texto ?? 'Normal'
    const displayedColor = selectedGlobalOption && selectedGlobalOption.id !== 'limpiarEstado'
        ? (selectedGlobalOption.color ?? 'gray')
        : 'gray'

    const toneToHex = (tone) => {
        switch (tone) {
            case 'red':
                return '#dc2626'
            case 'blue':
                return '#2563eb'
            case 'green':
                return '#16a34a'
            case 'gray':
            default:
                return '#475569'
        }
    }

    const globalButtonColorClass = (option) => {
        switch (option.color) {
            case 'red':
                return 'bg-red-500 text-white'
            case 'blue':
                return 'bg-blue-500 text-white'
            case 'green':
                return 'bg-green-500 text-white'
            case 'gray':
                return 'bg-gray-600 text-white'
            default:
                return 'bg-slate-200 text-slate-900'
        }
    }

    const treatmentButtonClasses = (option) => {
        if (surfaceSelectionDisabled) {
            return `p-2 rounded ${option.color} opacity-50 cursor-not-allowed`
        }
        const isSelected = selectedTreatment?.id === option.id
        return `p-2 rounded ${option.color} ${isSelected ? 'ring-2 ring-offset-1 ring-indigo-400' : ''} cursor-pointer`
    }

    const overlayStyle = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
    };

    const disenoEstado = (estadoNombre, estado, color) => {
        if (!estadoNombre || estadoNombre === 'limpiarEstado') {
            return null
        }

        const numero = diente.numero
        const toneHex = toneToHex(color)

        switch (estadoNombre) {
            case 'exodoncia':
                return (
                    <text
                        x="50"
                        y="64"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={toneHex}
                        fontSize="140"
                    >
                        {estado === 'Normal' ? '' : estado}
                    </text>
                )
            case 'exodonciaOrtodoncia':
                return (
                    <text
                        x="50"
                        y="64"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={toneHex}
                        fontSize="140"
                    >
                        X
                    </text>
                )
            case 'implante':
                return (
                    <image
                        href="https://img.icons8.com/?size=100&id=VZE4lkdKnHQr&format=png&color=000000"
                        x={50 - 75 / 2}
                        y={50 - 75 / 2}
                        width={75}
                        height={75}
                    />
                )
            case 'fractura':
                return (
                    <polyline
                        points="-10,62 10,42 30,62 50,42 70,62 90,42 110,62"
                        fill="none"
                        stroke={toneHex}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                )
            case 'ausenciaNatural':
            case 'exodonciaRealizada':
                return (
                    <text
                        x="50"
                        y="64"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={toneHex}
                        fontSize="140"
                    >
                        {estado === 'Normal' ? '' : estado}
                    </text>
                )
            case 'implanteRealizado':
                return (
                    <image
                        href="https://img.icons8.com/?size=100&id=VZE4lkdKnHQr&format=png&color=000000"
                        x={50 - 75 / 2}
                        y={50 - 75 / 2}
                        width={75}
                        height={75}
                    />
                )
            case 'implanteCoronarealizada': {
                const r = 45
                const imgSize = r * 2
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
                            stroke={toneHex}
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
                )
            }
            case 'extruido':
            case 'entruido':
                return null
            default:
                return (
                    <text
                        x="50"
                        y="55"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={toneHex}
                        fontSize="60"
                    >
                        {estado === 'Normal' ? '' : estado}
                    </text>
                )
        }
    }

    return (
        <div style={overlayStyle} onClick={onClose} className='overflow-x-auto'>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-5xl shadow-lg" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
                    <div className="flex flex-col items-center">
                        <div className="text-2xl font-semibold mb-2 dark:text-white">Diente {diente.numero}</div>
                        <svg viewBox="0 0 100 100" width={240} height={240} className="m-1">
                            <polygon
                                points="0,0 100,0 75,25 25,25"
                                className={getPolygonClass('vestibular')}
                                strokeWidth={3}
                                onClick={() => handleSurfaceClick('vestibular')}
                            />
                            <polygon
                                points="0,0 25,25 25,75 0,100"
                                className={getPolygonClass('distal')}
                                strokeWidth={3}
                                onClick={() => handleSurfaceClick('distal')}
                            />
                            <polygon
                                points="75,25 100,0 100,100 75,75"
                                className={getPolygonClass('mesial')}
                                strokeWidth={3}
                                onClick={() => handleSurfaceClick('mesial')}
                            />
                            <polygon
                                points="25,25 75,25 75,75 25,75"
                                className={getPolygonClass('oclusal')}
                                strokeWidth={3}
                                onClick={() => handleSurfaceClick('oclusal')}
                            />
                            <polygon
                                points="25,75 75,75 100,100 0,100"
                                className={getPolygonClass('palatino')}
                                strokeWidth={3}
                                onClick={() => handleSurfaceClick('palatino')}
                            />
                            {disenoEstado(displayedEstadoNombre, displayedEstado, displayedColor)}
                        </svg>
                        <p className="text-2xl font-semibold dark:text-white">{diente.numero}</p>
                        <div className={'text-center font-bold dark:text-white text-sm'}>{displayedEstado}</div>
                    </div>

                    <div className="w-full ">
                        <div className="mb-2 font-semibold dark:text-white">Opciones</div>
                        <div className="mb-2">
                            <div className="mb-1 dark:text-white">Tratamientos por superficie</div>
                            <div className="grid grid-cols-3 gap-2 mb-4 max-sm:grid-cols-2">
                                {surfaceOptions.map((op) => (
                                    <button
                                        key={op.id}
                                        onClick={() => setSelectedTreatment(op)}
                                        disabled={surfaceSelectionDisabled}
                                        className={treatmentButtonClasses(op)}
                                    >
                                        <span className='text-black dark:text-white'>{op.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="mb-1 dark:text-white">Acciones globales del diente</div>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {globalOptions.map((op) => {
                                    const isSelected = selectedGlobalId === op.id
                                    const buttonClass = globalButtonColorClass(op)
                                    return (
                                        <button
                                            key={op.id}
                                            onClick={() => handleGlobalSelect(op)}
                                            aria-pressed={isSelected}
                                            className={`p-2 cursor-pointer rounded ${isSelected ? 'ring-2 ring-offset-1 ring-indigo-400' : ''} ${buttonClass}`}
                                        >
                                            <div className='flex flex-col text-center'>
                                                <span className="max-sm:text-sm max-lg:truncate font-semibold text-black dark:text-white">{op.texto || ''}</span>
                                                <span className="max-sm:text-sm max-lg:truncate text-black dark:text-white">{op.label}</span>
                                            </div>
                                        </button>
                                    )
                                })}
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
