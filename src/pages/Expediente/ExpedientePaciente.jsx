import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router'
import { Avatar, TabItem, Tabs, Button, Modal, ModalHeader, ModalBody, Spinner, FileInput, Label, TextInput, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react'
import { HiClipboardList, HiUserCircle, HiOutlineTrash, HiOutlineDownload, HiOutlineExclamationCircle } from 'react-icons/hi'
import { MdDashboard } from 'react-icons/md'
import Navegacion from '../Common/Navegacion.jsx'
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

    // Anexos (archivos) state
    const [anexos, setAnexos] = useState([])
    const [loadingAnexos, setLoadingAnexos] = useState(false)
    const [errorAnexos, setErrorAnexos] = useState(null)
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [nombreAnexo, setNombreAnexo] = useState('')
    const [selectedAnexoToDelete, setSelectedAnexoToDelete] = useState(null)
    const [showDeleteAnexoModal, setShowDeleteAnexoModal] = useState(false)
    const [deletingAnexoId, setDeletingAnexoId] = useState(null)

    const [selectedAnexoToDownload, setSelectedAnexoToDownload] = useState(null)
    const [showDownloadModal, setShowDownloadModal] = useState(false)
    const [downloading, setDownloading] = useState(false)

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

    const fetchAnexos = useCallback(async (expedienteId) => {
        if (!expedienteId) {
            setAnexos([])
            return
        }

        const token = auth.getAccessToken?.()
        if (!token) return

        setLoadingAnexos(true)
        setErrorAnexos(null)
        try {
            const params = new URLSearchParams({ expediente: expedienteId })
            const resp = await fetch(`${API_URL}/expediente/anexos/?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!resp.ok) throw new Error(`Error ${resp.status}`)
            const data = await resp.json()
            // accept list or paginated
            const list = Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : [])
            setAnexos(list)
        } catch (err) {
            console.error('Error al cargar anexos:', err)
            setErrorAnexos('No se pudieron cargar los anexos.')
        } finally {
            setLoadingAnexos(false)
        }
    }, [auth])

    useEffect(() => {
        const odontogramaId = expediente?.odontograma?.id ?? null
        if (odontogramaId) {
            fetchVersions(odontogramaId)
        } else {
            setVersions([])
        }
        // Fetch anexos when expediente changes
        const expedienteId = expediente?.id ?? null
        if (expedienteId) fetchAnexos(expedienteId)
    }, [expediente?.odontograma?.id, fetchVersions])

    const openVersionModal = (version) => {
        setSelectedVersion(version)
        setShowVersionModal(true)
    }

    const closeVersionModal = () => {
        setSelectedVersion(null)
        setShowVersionModal(false)
    }

    const openUploadModal = () => {
        setSelectedFile(null)
        setNombreAnexo('')
        setErrorAnexos(null)
        setShowUploadModal(true)
    }

    const closeUploadModal = () => {
        setSelectedFile(null)
        setNombreAnexo('')
        setErrorAnexos(null)
        setShowUploadModal(false)
    }

    const handleFileChange = (files) => {
        if (!files) return
        const f = files[0]
        setSelectedFile(f)
    }
    const uploadAnexo = async () => {
        // backend requires a file and a name; enforce selection and name
        if (!selectedFile) {
            setErrorAnexos('Seleccione un archivo para subir.')
            return
        }
        if (!nombreAnexo || !nombreAnexo.trim()) {
            setErrorAnexos('El campo "Nombre del archivo" es OBLIGATORIO. Por favor ingréselo.')
            return
        }

        const token = auth.getAccessToken?.()
        if (!token) {
            setErrorAnexos('No autorizado')
            return
        }

        const form = new FormData()
        form.append('expediente', expediente.id)
        form.append('archivo', selectedFile)
        // map our nombreAnexo => nombre_original
        if (nombreAnexo) form.append('nombre_original', nombreAnexo)
        // no descripcion field in UI yet but leave placeholder
        // form.append('descripcion', descripcion)

        setUploading(true)
        setErrorAnexos(null)
        try {
            const resp = await fetch(`${API_URL}/expediente/anexos/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: form
            })

            if (resp.status === 201 || resp.status === 200) {
                // created
                await fetchAnexos(expediente.id)
                setSelectedFile(null)
                setNombreAnexo('')
                closeUploadModal()
            } else {
                const text = await resp.text()
                console.error('Upload error', resp.status, text)
                setErrorAnexos(`Error al subir el archivo (${resp.status})`)
            }
        } catch (err) {
            console.error('Error subiendo anexo:', err)
            setErrorAnexos('No se pudo subir el archivo.')
        } finally {
            setUploading(false)
        }
    }

    const deleteAnexo = async (id) => {
        if (!id) return
        const token = auth.getAccessToken?.()
        if (!token) {
            setErrorAnexos('No autorizado')
            return
        }
        setDeletingAnexoId(id)
        try {
            const resp = await fetch(`${API_URL}/expediente/anexos/${id}/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })
            if (resp.status === 204 || resp.status === 200) {
                await fetchAnexos(expediente.id)
            } else {
                const text = await resp.text()
                console.error('Delete error', resp.status, text)
                setErrorAnexos(`No se pudo eliminar el anexo (${resp.status})`)
            }
        } catch (err) {
            console.error('Error eliminando anexo:', err)
            setErrorAnexos('No se pudo eliminar el anexo.')
        } finally {
            setDeletingAnexoId(null)
            setShowDeleteAnexoModal(false)
            setSelectedAnexoToDelete(null)
        }
    }

    const abrirModalEliminarAnexo = (anexo) => {
        setSelectedAnexoToDelete(anexo)
        setShowDeleteAnexoModal(true)
    }

    const cerrarModalEliminarAnexo = () => {
        setSelectedAnexoToDelete(null)
        setShowDeleteAnexoModal(false)
    }

    const abrirModalDescargarAnexo = (anexo) => {
        setSelectedAnexoToDownload(anexo)
        setShowDownloadModal(true)
    }

    const cerrarModalDescargarAnexo = () => {
        setSelectedAnexoToDownload(null)
        setShowDownloadModal(false)
    }

    const downloadAnexo = async (id) => {
        if (!id) return
        const anexo = anexos.find((x) => x.id === id) || selectedAnexoToDownload
        if (!anexo) {
            setErrorAnexos('Anexo no encontrado')
            return
        }

        // Prefer the public archivo_url returned by the backend (Cloudinary public URL)
        let publicUrl = anexo.archivo_url || anexo.archivo || anexo.url || null
        let filename = anexo.nombre_original || anexo.nombre || null

        setDownloading(true)
        try {
            // If we don't have a public URL, ask backend for a download_url (authenticated)
            if (!publicUrl) {
                const token = auth.getAccessToken?.()
                if (!token) {
                    setErrorAnexos('No autorizado')
                    return
                }
                const resp = await fetch(`${API_URL}/expediente/anexos/${id}/download_url/`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (!resp.ok) {
                    const txt = await resp.text().catch(() => null)
                    console.error('Error obteniendo download_url', resp.status, txt)
                    setErrorAnexos(`No se pudo obtener la URL de descarga (${resp.status})`)
                    return
                }
                const data = await resp.json().catch(() => null)
                publicUrl = data?.url || null
                filename = filename || data?.filename || filename
                if (!publicUrl) {
                    setErrorAnexos('URL de descarga no disponible desde el backend')
                    return
                }
            }

            // Fetch the file from the public URL WITHOUT sending Authorization (Cloudinary expects public access)
            const respFile = await fetch(publicUrl)
            if (!respFile.ok) {
                const txt = await respFile.text().catch(() => null)
                console.error('Download error', respFile.status, txt)
                setErrorAnexos(`No se pudo descargar el anexo (${respFile.status})`)
                return
            }
            const blob = await respFile.blob()
            const inferredName = filename || (new URL(publicUrl).pathname.split('/').pop()) || 'archivo'
            const blobUrl = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = blobUrl
            a.download = inferredName
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(blobUrl)
        } catch (err) {
            console.error('Error descargando anexo:', err)
            setErrorAnexos('No se pudo descargar el anexo.')
        } finally {
            setDownloading(false)
            setShowDownloadModal(false)
            setSelectedAnexoToDownload(null)
        }
    }

    return (
        <Navegacion>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4 dark:text-white">Expediente del Paciente</h1>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-12 min-h-[400px]">
                        <Spinner size="xl" className="mb-4" />
                        <span className="text-lg text-gray-600 dark:text-gray-400">Cargando expediente...</span>
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
                                        <div>
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
                                        </div>
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

                                    {/* Delete confirmation modal for anexos */}
                                    <Modal show={showDeleteAnexoModal} size="md" onClose={cerrarModalEliminarAnexo} popup position="center">
                                        <ModalHeader />
                                        <ModalBody>
                                            <div className="text-center">
                                                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                                <h3 className="mb-5 text-lg font-normal text-gray-600 dark:text-gray-300">
                                                    ¿Eliminar el anexo "{selectedAnexoToDelete?.nombre_original || selectedAnexoToDelete?.nombre || selectedAnexoToDelete?.archivo?.split('/')?.pop()}"?
                                                </h3>
                                                <div className="flex justify-center gap-4">
                                                    <Button color="red" onClick={() => deleteAnexo(selectedAnexoToDelete?.id)} isProcessing={deletingAnexoId === selectedAnexoToDelete?.id} disabled={deletingAnexoId === selectedAnexoToDelete?.id}>
                                                        Eliminar
                                                    </Button>
                                                    <Button color="gray" onClick={cerrarModalEliminarAnexo}>
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            </div>
                                        </ModalBody>
                                    </Modal>

                                    {/* Download confirmation modal for anexos */}
                                    <Modal show={showDownloadModal} size="md" onClose={cerrarModalDescargarAnexo} popup position="center">
                                        <ModalHeader />
                                        <ModalBody>
                                            <div className="text-center">
                                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Confirmar descarga</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">¿Desea descargar el anexo "{selectedAnexoToDownload?.nombre_original || selectedAnexoToDownload?.nombre || selectedAnexoToDownload?.archivo?.split('/')?.pop()}"?</p>
                                                <div className="flex justify-center gap-4">
                                                    <Button color="purple" onClick={() => downloadAnexo(selectedAnexoToDownload?.id)} isProcessing={downloading} disabled={downloading}>
                                                        Descargar
                                                    </Button>
                                                    <Button color="gray" onClick={cerrarModalDescargarAnexo}>
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            </div>
                                        </ModalBody>
                                    </Modal>

                                </div>
                            </TabItem>
                            <TabItem title="Archivos adicionales" icon={HiClipboardList}>
                                <div>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-300 font-semibold">Archivos adicionales</p>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Adjuntos relacionados al expediente</div>
                                        </div>
                                        <Button color="purple" onClick={openUploadModal}>Subir anexo</Button>
                                    </div>

                                    {errorAnexos && (
                                        <div className="mb-4 rounded bg-red-100 p-3 text-red-700 dark:bg-red-950 dark:text-red-200">{errorAnexos}</div>
                                    )}

                                    <div className="overflow-x-auto rounded-lg shadow-sm">
                                        <Table hoverable className="text-center">
                                            <TableHead>
                                                <TableRow>
                                                    <TableHeadCell>Nombre</TableHeadCell>
                                                    <TableHeadCell>Creado</TableHeadCell>
                                                    <TableHeadCell>Descargar</TableHeadCell>
                                                    <TableHeadCell>Eliminar</TableHeadCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody className="divide-y">
                                                {loadingAnexos ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center py-6 text-gray-500 dark:text-gray-300">Cargando anexos...</TableCell>
                                                    </TableRow>
                                                ) : anexos.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center py-6 text-gray-500 dark:text-gray-300">No hay anexos.</TableCell>
                                                    </TableRow>
                                                ) : (
                                                    anexos.map((a) => (
                                                        <TableRow key={a.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                <a href={a.archivo || a.url} target="_blank" rel="noreferrer" className="text-blue-600">{a.nombre_original || a.nombre || a.archivo || 'Documento'}</a>
                                                            </TableCell>
                                                            <TableCell>{(a.created_at || a.fecha_creado) ? new Date(a.created_at || a.fecha_creado).toLocaleString() : '-'}</TableCell>
                                                            <TableCell>
                                                                <HiOutlineDownload size={18} className="cursor-pointer text-gray-500 hover:text-gray-700 mx-auto" onClick={() => abrirModalDescargarAnexo(a)} />
                                                            </TableCell>
                                                            <TableCell>
                                                                <HiOutlineTrash size={18} className="cursor-pointer text-gray-500 hover:text-red-600 mx-auto" onClick={() => abrirModalEliminarAnexo(a)} />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Upload modal for anexos */}
                                    <Modal show={showUploadModal} onClose={closeUploadModal} popup>
                                        <ModalHeader />
                                        <ModalBody className="pt-4  bg-white text-gray-900 dark:bg-gray-800">
                                            <div className="text-left space-y-4">
                                                <div>
                                                    <div className="mb-2 block">
                                                        <Label htmlFor="nombreAnexo">Nombre del archivo <span className="text-red-600">*</span></Label>
                                                    </div>
                                                    <TextInput id="nombreAnexo" value={nombreAnexo} onChange={(e) => setNombreAnexo(e.target.value)} placeholder="Nombre para el anexo (obligatorio)" required aria-required={true} />
                                                </div>

                                                <div className="flex w-full items-center justify-center">
                                                    <Label
                                                        htmlFor="dropzone-file"
                                                        onDrop={(e) => { e.preventDefault(); if (e.dataTransfer?.files?.length) handleFileChange(e.dataTransfer.files); }}
                                                        onDragOver={(e) => e.preventDefault()}
                                                        className="flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                                    >
                                                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                                            <svg
                                                                className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                                                                aria-hidden="true"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 20 16"
                                                            >
                                                                <path
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                                />
                                                            </svg>
                                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                        </div>
                                                        <FileInput id="dropzone-file" className="hidden" onChange={(e) => handleFileChange(e.target.files)} />
                                                    </Label>
                                                </div>

                                                {/* show selected file name */}
                                                {selectedFile && (
                                                    <div className="text-sm text-black dark:text-white mt-2">Archivo seleccionado: {selectedFile.name}</div>
                                                )}

                                                <div className="flex justify-end gap-2">
                                                    <Button color="gray" onClick={closeUploadModal}>Cancelar</Button>
                                                    <Button color="purple" onClick={uploadAnexo} disabled={uploading || !selectedFile || !nombreAnexo || !nombreAnexo.trim()}>{uploading ? 'Procesando...' : 'Agregar'}</Button>
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