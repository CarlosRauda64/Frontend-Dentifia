import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router'
import { Avatar, TabItem, Tabs, Button, Modal, ModalHeader, ModalBody } from 'flowbite-react'
import { HiClipboardList, HiUserCircle } from 'react-icons/hi'
import { MdDashboard } from 'react-icons/md'
import Navegacion from '../Common/Navegacion.jsx'
import Loading from '../Common/Loading.jsx'
import FichaOrtodoncia from '../../fichaOrtodoncia/fichaOrtodoncia.jsx'
import Odontograma from '../Odontograma/Odontrograma.jsx'
import { API_URL } from '../../api/api'
import { useAuth } from '../../auth/useAuth'

const formatDateTime = (isoDate) => {
    if (!isoDate) return 'Fecha no disponible'
    try {
        return new Date(isoDate).toLocaleString('es-SV', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return isoDate
    }
}

const DatosPaciente = () => {
    const auth = useAuth()
    const location = useLocation()
    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search])
    const expedienteIdParam = searchParams.get('expediente')
    const pacienteIdParam = searchParams.get('paciente')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [expediente, setExpediente] = useState(null)

    const fetchExpediente = useCallback(async () => {
        if (!auth?.isAuthenticated) {
            setExpediente(null)
            return
        }

        const token = auth.getAccessToken()
        if (!token) {
            return
        }

        setLoading(true)
        setError(null)

        try {
            let url = ''
            if (expedienteIdParam) {
                url = `${API_URL}/expediente/expedientes/${expedienteIdParam}/`
            } else {
                const params = new URLSearchParams()
                params.set('expand', 'full')
                if (pacienteIdParam) {
                    params.set('paciente', pacienteIdParam)
                }
                url = `${API_URL}/expediente/expedientes/?${params.toString()}`
            }

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error(`Error ${response.status}`)
            }

            const data = await response.json()
            let expedienteData = null

            if (Array.isArray(data)) {
                expedienteData = data[0] ?? null
            } else if (data?.results) {
                expedienteData = data.results[0] ?? null
            } else {
                expedienteData = data
            }

            if (!expedienteData) {
                setExpediente(null)
                setError('No se encontró un expediente con los criterios proporcionados.')
                return
            }

            setExpediente(expedienteData)
        } catch (err) {
            console.error('Error al cargar el expediente:', err)
            setError('No se pudo cargar el expediente. Intenta nuevamente más tarde.')
        } finally {
            setLoading(false)
        }
    }, [auth, expedienteIdParam, pacienteIdParam])

    useEffect(() => {
        if (!auth?.isAuthenticated) return
        fetchExpediente()
    }, [auth?.isAuthenticated, fetchExpediente])

    const paciente = expediente?.paciente_detalle
    const pacienteNombre = paciente?.nombre_completo ?? 'Paciente sin nombre'
    const expedienteNumero = expediente?.numero_expediente ?? 'Sin número'

    // Versions state for odontograma
    const [versions, setVersions] = useState([])
    const [loadingVersions, setLoadingVersions] = useState(false)
    const [errorVersions, setErrorVersions] = useState(null)
    const [selectedVersion, setSelectedVersion] = useState(null)
    const [showVersionModal, setShowVersionModal] = useState(false)

    const parseListado = (payload) => {
        if (!payload) return []
        if (Array.isArray(payload)) return payload
        if (Array.isArray(payload?.results)) return payload.results
        return []
    }

    const fetchVersions = useCallback(async (odontogramaId) => {
        if (!odontogramaId) {
            setVersions([])
            return
        }

        const token = auth.getAccessToken?.()
        if (!token) return

        setLoadingVersions(true)
        setErrorVersions(null)

        try {
            const params = new URLSearchParams({ odontograma: odontogramaId })
            const resp = await fetch(`${API_URL}/expediente/odontograma-versiones/?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (!resp.ok) {
                throw new Error(`Error ${resp.status}`)
            }

            const data = await resp.json()
            setVersions(parseListado(data).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
        } catch (err) {
            console.error('Error al cargar versiones del odontograma:', err)
            setErrorVersions('No se pudieron cargar las versiones del odontograma.')
        } finally {
            setLoadingVersions(false)
        }
    }, [auth])

    useEffect(() => {
        const odontogramaId = expediente?.odontograma?.id ?? null
        if (odontogramaId) {
            fetchVersions(odontogramaId)
        } else {
            setVersions([])
        }
    }, [expediente?.odontograma?.id, fetchVersions])

    const openVersionModal = (version) => {
        setSelectedVersion(version)
        setShowVersionModal(true)
    }

    const closeVersionModal = () => {
        setSelectedVersion(null)
        setShowVersionModal(false)
    }

    return (
        <Navegacion>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4 dark:text-white">Expediente del Paciente</h1>

                {loading && (
                    <div className="flex justify-center items-center py-10">
                        <Loading />
                    </div>
                )}

                {!loading && error && (
                    <div className="p-6 bg-red-100 text-red-700 rounded-lg mb-6 dark:bg-red-950 dark:text-red-200">
                        {error}
                    </div>
                )}

                {!loading && !error && !expediente && (
                    <div className="p-6 bg-yellow-100 text-yellow-800 rounded-lg mb-6 dark:bg-yellow-700 dark:text-yellow-100">
                        No hay expediente disponible para mostrar.
                    </div>
                )}

                {!loading && expediente && (
                    <>
                        <div className="flex flex-col md:flex-row md:items-center p-4 bg-white dark:bg-gray-800 shadow-md rounded-2xl">
                            <Avatar
                                rounded
                                placeholderInitials={`${(paciente?.nombres ?? ' ')[0] ?? ''}${(paciente?.apellidos ?? ' ')[0] ?? ''}`.trim()}
                                className="w-16 h-16"
                            />
                            <div className="md:ml-4 mt-4 md:mt-0 space-y-1">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{pacienteNombre}</h2>
                                <p className="text-gray-700 dark:text-gray-300">Expediente N°: <span className="font-semibold">{expedienteNumero}</span></p>
                                <p className="text-gray-700 dark:text-gray-300">Creado el: {formatDateTime(expediente?.created_at)}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 text-gray-700 dark:text-gray-300">
                                    <span>Teléfono: {paciente?.telefono || 'No registrado'}</span>
                                    <span>Celular: {paciente?.celular || 'No registrado'}</span>
                                    <span>Email: {paciente?.email || 'No registrado'}</span>
                                </div>
                            </div>
                        </div>

                        <Tabs aria-label="Tabs del expediente" variant="underline" className="mt-6">
                            <TabItem active title="Ficha de Ortodoncia" icon={HiUserCircle}>
                                <FichaOrtodoncia expedienteId={expediente.id} onRefresh={fetchExpediente} />
                            </TabItem>
                            <TabItem title="Odontograma" icon={MdDashboard}>
                                <Odontograma
                                    expedienteId={expediente.id}
                                    odontograma={expediente.odontograma}
                                    onVersionCreated={fetchExpediente}
                                />
                            </TabItem>
                            <TabItem title="Versiones del odontograma" icon={HiClipboardList}>
                                <div className="text-gray-700 dark:text-gray-200">
                                    {!expediente?.odontograma?.id ? (
                                        <div className="p-4 bg-yellow-50 dark:bg-gray-900 rounded">
                                            <p>No se encontró un odontograma asociado a este expediente.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-semibold">Historial de versiones</h3>
                                                <div className="flex gap-2">
                                                    <Button size="sm" onClick={() => fetchVersions(expediente.odontograma.id)} disabled={loadingVersions}>
                                                        {loadingVersions ? 'Cargando...' : 'Actualizar'}
                                                    </Button>
                                                </div>
                                            </div>

                                            {errorVersions && (
                                                <div className="mb-3 rounded bg-red-100 p-3 text-red-700 dark:bg-red-950 dark:text-red-200">{errorVersions}</div>
                                            )}

                                            {loadingVersions ? (
                                                <div className="py-6 text-center">Cargando versiones...</div>
                                            ) : versions.length === 0 ? (
                                                <div className="py-6 text-center text-gray-600 dark:text-gray-300">No hay versiones registradas.</div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {versions.map((v) => (
                                                        <div key={v.id} className="p-3 bg-white dark:bg-gray-800 rounded shadow-sm">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(v.created_at).toLocaleString('es-SV')}</div>
                                                                    <div className="font-semibold text-gray-900 dark:text-white">{v.comentario || 'Sin comentario'}</div>
                                                                    <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Detalles: {Array.isArray(v.detalles) ? v.detalles.length : 0}</div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Button size="sm" onClick={() => openVersionModal(v)}>Ver detalles</Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <Modal show={showVersionModal} size="8xl" onClose={closeVersionModal} popup position="center">
                                        <ModalHeader />
                                        <ModalBody>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-lg font-semibold text-black dark:text-white">Detalles de la versión</h4>
                                                        <div className="text-sm text-gray-500">{selectedVersion ? new Date(selectedVersion.created_at).toLocaleString('es-SV') : ''}</div>
                                                    </div>
                                                    <div className="text-sm text-gray-700 dark:text-gray-200">
                                                        <p className="mb-2">Comentario: {selectedVersion?.comentario || 'Sin comentario'}</p>

                                                        <div className="border rounded p-2 bg-white dark:bg-gray-800">
                                                            {selectedVersion ? (
                                                                <div className="max-h-[70vh]">
                                                                    <Odontograma
                                                                        expedienteId={expediente.id}
                                                                        odontograma={{ id: expediente?.odontograma?.id ?? null, versiones: [selectedVersion] }}
                                                                        readOnly={true}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="text-sm text-gray-500">No hay datos para previsualizar.</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <Button color="gray" onClick={closeVersionModal}>Cerrar</Button>
                                                    </div>
                                                </div>
                                            </ModalBody>
                                    </Modal>
                                </div>
                            </TabItem>
                        </Tabs>
                    </>
                )}
            </div>
        </Navegacion>
    )
}

export default DatosPaciente