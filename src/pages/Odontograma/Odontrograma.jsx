import React, { useEffect, useMemo, useState } from 'react'
import Diente from './Diente'
import ModalDiente from './ModalDiente'
import { Button, Label, Textarea } from 'flowbite-react'
import Loading from '../Common/Loading.jsx'
import { useAuth } from '../../auth/useAuth'
import { API_URL } from '../../api/api'

const LAYOUT = [
    { left: [18, 17, 16, 15, 14, 13, 12, 11], right: [21, 22, 23, 24, 25, 26, 27, 28] },
    { left: [55, 54, 53, 52, 51], right: [61, 62, 63, 64, 65] },
    { left: [85, 84, 83, 82, 81], right: [71, 72, 73, 74, 75] },
    { left: [48, 47, 46, 45, 44, 43, 42, 41], right: [31, 32, 33, 34, 35, 36, 37, 38] }
]

const SURFACE_KEYS = ['oclusal', 'mesial', 'distal', 'palatino', 'vestibular']

const CARA_TO_KEY = {
    O: 'oclusal',
    M: 'mesial',
    D: 'distal',
    V: 'vestibular',
    P: 'palatino'
}

const KEY_TO_CARA = {
    oclusal: 'O',
    mesial: 'M',
    distal: 'D',
    palatino: 'P',
    vestibular: 'V'
}

const createEmptySurfaces = () => ({
    oclusal: null,
    mesial: null,
    distal: null,
    palatino: null,
    vestibular: null
})

const createInitialDientes = () => {
    const allNumbers = LAYOUT.flatMap((row) => [...row.left, ...row.right])
    return allNumbers.map((numero) => ({
        numero,
        superficies: createEmptySurfaces(),
        globalConditionId: null
    }))
}

const buildDientesFromVersion = (version) => {
    const dientes = createInitialDientes()
    if (!version || !Array.isArray(version.detalles)) {
        return dientes
    }

    const indexByNumero = new Map(dientes.map((diente, index) => [diente.numero, index]))

    version.detalles.forEach((detalle) => {
        const targetIndex = indexByNumero.get(detalle.pieza_numero)
        if (targetIndex === undefined) return

        if (detalle.cara === 'GLOBAL') {
            dientes[targetIndex].globalConditionId = detalle.condicion
            return
        }

        const key = CARA_TO_KEY[detalle.cara]
        if (!key) return
        dientes[targetIndex].superficies[key] = detalle.condicion
    })

    return dientes
}

const Odontrograma = ({ expedienteId, odontograma, onVersionCreated }) => {
    const auth = useAuth()

    const [dientes, setDientes] = useState(() => createInitialDientes())
    const [modalState, setModalState] = useState({ visible: false, numero: null })
    const [comentario, setComentario] = useState('')
    const [odontogramaId, setOdontogramaId] = useState(odontograma?.id ?? null)
    const [ultimaVersion, setUltimaVersion] = useState(null)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    const dientesMap = useMemo(() => new Map(dientes.map((d) => [d.numero, d])), [dientes])

    useEffect(() => {
        if (!odontograma) {
            setOdontogramaId(null)
            setUltimaVersion(null)
            setDientes(createInitialDientes())
            return
        }

        setOdontogramaId(odontograma.id)
        const latest = odontograma.versiones?.[0] ?? null
        setUltimaVersion(latest)
        setDientes(buildDientesFromVersion(latest))
        setComentario('')
        setError(null)
    }, [odontograma])

    useEffect(() => {
        if (odontograma || !expedienteId || !auth?.isAuthenticated) return

        let cancelled = false
        const token = auth.getAccessToken?.()
        if (!token) return

        const load = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await fetch(`${API_URL}/expediente/odontogramas/por-expediente/${expedienteId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (response.status === 404) {
                    if (!cancelled) {
                        setOdontogramaId(null)
                        setUltimaVersion(null)
                        setDientes(createInitialDientes())
                    }
                    return
                }

                if (!response.ok) {
                    throw new Error(`Error ${response.status}`)
                }

                const data = await response.json()
                if (cancelled) return

                setOdontogramaId(data.id)
                const latest = data.versiones?.[0] ?? null
                setUltimaVersion(latest)
                setDientes(buildDientesFromVersion(latest))
                setComentario('')
            } catch (err) {
                if (!cancelled) {
                    console.error('Error al cargar el odontograma:', err)
                    setError('No se pudo cargar el odontograma del expediente.')
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        load()

        return () => {
            cancelled = true
        }
    }, [odontograma, expedienteId, auth])

    const surfaceOptions = useMemo(() => ([
        { id: 'caries', label: 'Caries', colorClass: 'fill-red-400', color: 'bg-red-500' },
        { id: 'obturacion', label: 'Obturación', colorClass: 'fill-blue-400', color: 'bg-blue-500' },
        { id: 'cariesRadiograficas', label: 'Caries Radiográficas', colorClass: 'fill-green-400', color: 'bg-green-500' },
        { id: 'sellante', label: 'Sellante', colorClass: 'fill-yellow-400', color: 'bg-yellow-500' },
        { id: 'limpiar', label: 'Limpiar Superficie', colorClass: '', color: 'bg-gray-500' }
    ]), [])

    const globalOptions = useMemo(() => ([
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
        { id: 'limpiarEstado', label: 'Limpiar Estado', texto: 'Normal', color: 'green' }
    ]), [])

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

    const handleCaraClick = (numero, event) => {
        event.stopPropagation()
        setModalState({ visible: true, numero })
    }

    const handleModalClose = () => {
        setModalState({ visible: false, numero: null })
    }

    const handleModalSave = ({ numero, superficies, globalConditionId }) => {
        setDientes((prev) => prev.map((diente) => {
            if (diente.numero !== numero) return diente
            return {
                ...diente,
                superficies: { ...createEmptySurfaces(), ...superficies },
                globalConditionId: globalConditionId ?? null
            }
        }))
        handleModalClose()
    }

    const limpiarDiente = (numero) => {
        setDientes((prev) => prev.map((diente) => {
            if (diente.numero !== numero) return diente
            return {
                ...diente,
                superficies: createEmptySurfaces(),
                globalConditionId: null
            }
        }))
    }

    const handleGuardarVersion = async () => {
        if (!odontogramaId) {
            setError('No existe un odontograma asociado para guardar la versión.')
            return
        }

        const token = auth.getAccessToken?.()
        if (!token) return

        const detalles = []

        dientes.forEach((diente) => {
            if (diente.globalConditionId) {
                detalles.push({
                    pieza_numero: diente.numero,
                    cara: 'GLOBAL',
                    condicion: diente.globalConditionId
                })
            }

            SURFACE_KEYS.forEach((key) => {
                const condicion = diente.superficies?.[key]
                if (condicion) {
                    detalles.push({
                        pieza_numero: diente.numero,
                        cara: KEY_TO_CARA[key],
                        condicion
                    })
                }
            })
        })

        setSaving(true)
        setError(null)

        try {
            const response = await fetch(`${API_URL}/expediente/odontograma-versiones/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    odontograma: odontogramaId,
                    comentario,
                    detalles
                })
            })

            if (!response.ok) {
                throw new Error(`Error ${response.status}`)
            }

            const data = await response.json()
            setUltimaVersion(data)
            setDientes(buildDientesFromVersion(data))
            setComentario('')
            onVersionCreated?.()
        } catch (err) {
            console.error('Error al guardar la versión del odontograma:', err)
            setError('No se pudo guardar la nueva versión del odontograma.')
        } finally {
            setSaving(false)
        }
    }

    const selectedDiente = modalState.visible ? dientesMap.get(modalState.numero) : null

    return (
        <div className="p-4 w-full">
            {loading && (
                <div className="py-6 flex justify-center">
                    <Loading />
                </div>
            )}

            <div className="space-y-4">
                {LAYOUT.map((row, idx) => (
                    <div key={idx} className="flex justify-center items-center px-4">
                        <div className="flex flex-wrap justify-center items-center">
                            {row.left.map((num) => {
                                const diente = dientesMap.get(num)
                                const globalOption = diente?.globalConditionId ? globalOptionMap[diente.globalConditionId] : null
                                const estado = globalOption ? globalOption.texto : 'Normal'
                                const estadoNombre = globalOption ? globalOption.id : ''
                                const color = globalOption ? globalOption.color : 'gray'
                                const superficiesRender = {}
                                SURFACE_KEYS.forEach((key) => {
                                    const condicion = diente?.superficies?.[key]
                                    superficiesRender[key] = condicion ? surfaceClassMap[condicion] : ''
                                })
                                return (
                                    <Diente
                                        key={num}
                                        numero={num}
                                        superficies={superficiesRender}
                                        estado={estado}
                                        estadoNombre={estadoNombre}
                                        color={color}
                                        onCaraClick={handleCaraClick}
                                        limpiarDiente={limpiarDiente}
                                        size={40}
                                    />
                                )
                            })}
                        </div>

                        <div className="w-6 sm:w-10 flex-none" />

                        <div className="flex flex-wrap justify-center items-center">
                            {row.right.map((num) => {
                                const diente = dientesMap.get(num)
                                const globalOption = diente?.globalConditionId ? globalOptionMap[diente.globalConditionId] : null
                                const estado = globalOption ? globalOption.texto : 'Normal'
                                const estadoNombre = globalOption ? globalOption.id : ''
                                const color = globalOption ? globalOption.color : 'gray'
                                const superficiesRender = {}
                                SURFACE_KEYS.forEach((key) => {
                                    const condicion = diente?.superficies?.[key]
                                    superficiesRender[key] = condicion ? surfaceClassMap[condicion] : ''
                                })
                                return (
                                    <Diente
                                        key={num}
                                        numero={num}
                                        superficies={superficiesRender}
                                        estado={estado}
                                        estadoNombre={estadoNombre}
                                        color={color}
                                        onCaraClick={handleCaraClick}
                                        limpiarDiente={limpiarDiente}
                                        size={40}
                                    />
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {modalState.visible && selectedDiente && (
                <ModalDiente
                    visible={modalState.visible}
                    diente={selectedDiente}
                    onSave={handleModalSave}
                    onClose={handleModalClose}
                    surfaceOptions={surfaceOptions}
                    globalOptions={globalOptions}
                />
            )}

            <div className="w-full my-6 max-w-full">
                <div className="mb-2 block">
                    <Label htmlFor="odontograma-comment">Comentario de la versión</Label>
                </div>
                <Textarea
                    id="odontograma-comment"
                    placeholder="Describe los cambios realizados antes de guardar una nueva versión."
                    rows={4}
                    className="resize-none w-full"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
                    {ultimaVersion && (
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                            Última versión guardada: {new Date(ultimaVersion.created_at).toLocaleString('es-SV')}
                        </p>
                    )}
                    <Button
                        color="purple"
                        onClick={handleGuardarVersion}
                        disabled={saving || !odontogramaId}
                        isProcessing={saving}
                    >
                        Guardar versión
                    </Button>
                </div>
                {error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
            </div>
        </div>
    )
}

export default Odontrograma