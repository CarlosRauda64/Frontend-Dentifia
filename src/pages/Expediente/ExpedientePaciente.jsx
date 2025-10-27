import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router'
import { Avatar, TabItem, Tabs } from 'flowbite-react'
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
                            <TabItem title="Datos adicionales" icon={HiClipboardList}>
                                <div className="text-gray-700 dark:text-gray-200">
                                    <p>Los datos adicionales del expediente se integrarán en futuras versiones.</p>
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