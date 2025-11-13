import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    Label,
    TextInput,
    Select,
    Textarea
} from "flowbite-react";
import {
    HiOutlineDocumentText,
    HiOutlineExclamationCircle,
    HiOutlinePlus,
    HiOutlineTrash
} from "react-icons/hi";
import { useNavigate } from "react-router";
import { API_URL } from "../api/api";
import { useAuth } from "../auth/useAuth";

const ESTADO_TRATAMIENTO_OPCIONES = [
    { value: "activo", label: "Activo" },
    { value: "finalizado", label: "Finalizado" }
]

const FICHA_INICIAL = {
    motivo_consulta_inicial: "",
    diagnostico: "",
    oclusion: "",
    mordida: "",
    plan_tratamiento: "",
    estado_tratamiento: "activo"
}

const NOTA_INICIAL = {
    motivo_visita: "",
    observaciones_clinicas: "",
    procedimiento_realizado: "",
    odontograma_comentarios: "",
    odontograma_snapshot: []
}

const parseListado = (payload) => {
    if (!payload) return []
    if (Array.isArray(payload)) return payload
    if (Array.isArray(payload?.results)) return payload.results
    return []
}

const formatDate = (iso) => {
    if (!iso) return "-"
    try {
        return new Date(iso).toLocaleString('es-SV')
    } catch {
        return iso
    }
}

const traducirEstado = (valor) => {
    const encontrado = ESTADO_TRATAMIENTO_OPCIONES.find((op) => op.value === valor)
    return encontrado?.label ?? valor ?? 'Sin estado'
}

const TableFichas = ({ expedienteId, onRefresh }) => {
    const navigate = useNavigate()
    const auth = useAuth()

    const [fichas, setFichas] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [fichaSeleccionada, setFichaSeleccionada] = useState(null)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [newFicha, setNewFicha] = useState(FICHA_INICIAL)
    const [savingFicha, setSavingFicha] = useState(false)

    const [openNotesModal, setOpenNotesModal] = useState(false)
    const [selectedFichaForNotas, setSelectedFichaForNotas] = useState(null)
    const [notas, setNotas] = useState([])
    const [loadingNotas, setLoadingNotas] = useState(false)
    const [errorNotas, setErrorNotas] = useState(null)
    const [openCreateNotaModal, setOpenCreateNotaModal] = useState(false)
    const [newNota, setNewNota] = useState(NOTA_INICIAL)
    const [savingNota, setSavingNota] = useState(false)
    const [deletingNotaId, setDeletingNotaId] = useState(null)

    const tieneAcceso = auth?.isAuthenticated && Boolean(expedienteId)

    const getToken = useCallback(() => {
        const token = auth.getAccessToken?.()
        return token || null
    }, [auth])

    const fetchFichas = useCallback(async () => {
        if (!tieneAcceso) {
            setFichas([])
            return
        }

        const token = getToken()
        if (!token) {
            return
        }

        setLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams({ expediente: expedienteId })
            const response = await fetch(`${API_URL}/expediente/fichas-ortodoncia/?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error(`Error ${response.status}`)
            }

            const data = await response.json()
            setFichas(parseListado(data))
        } catch (err) {
            console.error('Error al cargar las fichas de ortodoncia:', err)
            setError('No se pudieron cargar las fichas de ortodoncia.')
        } finally {
            setLoading(false)
        }
    }, [tieneAcceso, expedienteId, getToken])

    useEffect(() => {
        fetchFichas()
    }, [fetchFichas])

    const abrirModalEliminar = (ficha) => {
        setFichaSeleccionada(ficha)
        setOpenDeleteModal(true)
    }

    const cerrarModalEliminar = () => {
        setFichaSeleccionada(null)
        setOpenDeleteModal(false)
    }

    const confirmarEliminar = async () => {
        if (!fichaSeleccionada) return
        const token = getToken()
        if (!token) return

        try {
            const response = await fetch(`${API_URL}/expediente/fichas-ortodoncia/${fichaSeleccionada.id}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok && response.status !== 204) {
                throw new Error(`Error ${response.status}`)
            }

            await fetchFichas()
            onRefresh?.()
        } catch (err) {
            console.error('Error al eliminar la ficha:', err)
        } finally {
            cerrarModalEliminar()
        }
    }

    const abrirModalNotas = (ficha) => {
        setSelectedFichaForNotas(ficha)
        setOpenNotesModal(true)
        cargarNotas(ficha.id)
    }

    const cerrarModalNotas = () => {
        setSelectedFichaForNotas(null)
        setNotas([])
        setOpenNotesModal(false)
        setErrorNotas(null)
    }

    const cargarNotas = useCallback(async (fichaId) => {
        if (!fichaId) return
        const token = getToken()
        if (!token) return

        setLoadingNotas(true)
        setErrorNotas(null)

        try {
            const params = new URLSearchParams({ ficha_ortodoncia: fichaId })
            const response = await fetch(`${API_URL}/expediente/notas-progreso/?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error(`Error ${response.status}`)
            }

            const data = await response.json()
            setNotas(parseListado(data))
        } catch (err) {
            console.error('Error al cargar las notas de progreso:', err)
            setErrorNotas('No se pudieron cargar las notas de progreso.')
        } finally {
            setLoadingNotas(false)
        }
    }, [getToken])

    const resetNuevaFicha = () => {
        setNewFicha(FICHA_INICIAL)
    }

    const resetNuevaNota = () => {
        setNewNota(NOTA_INICIAL)
    }

    const guardarNuevaFicha = async () => {
        if (!tieneAcceso) return
        const token = getToken()
        if (!token) return

        setSavingFicha(true)
        try {
            const respuesta = await fetch(`${API_URL}/expediente/fichas-ortodoncia/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    expediente: expedienteId,
                    ...newFicha
                })
            })

            if (!respuesta.ok) {
                throw new Error(`Error ${respuesta.status}`)
            }

            await fetchFichas()
            onRefresh?.()
            setOpenCreateModal(false)
            resetNuevaFicha()
        } catch (err) {
            console.error('Error al crear la ficha:', err)
        } finally {
            setSavingFicha(false)
        }
    }

    const guardarNuevaNota = async () => {
        if (!selectedFichaForNotas) return
        const token = getToken()
        if (!token) return

        setSavingNota(true)
        try {
            const payload = {
                ficha_ortodoncia: selectedFichaForNotas.id,
                motivo_visita: newNota.motivo_visita,
                observaciones_clinicas: newNota.observaciones_clinicas,
                procedimiento_realizado: newNota.procedimiento_realizado,
                odontograma_comentarios: newNota.odontograma_comentarios,
                odontograma_snapshot: newNota.odontograma_snapshot ?? []
            }

            const respuesta = await fetch(`${API_URL}/expediente/notas-progreso/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (!respuesta.ok) {
                throw new Error(`Error ${respuesta.status}`)
            }

            resetNuevaNota()
            setOpenCreateNotaModal(false)
            await cargarNotas(selectedFichaForNotas.id)
            onRefresh?.()
        } catch (err) {
            console.error('Error al crear la nota de progreso:', err)
        } finally {
            setSavingNota(false)
        }
    }

    const eliminarNota = async (notaId) => {
        if (!selectedFichaForNotas || !notaId) return
        const token = getToken()
        if (!token) return

        setDeletingNotaId(notaId)
        try {
            const respuesta = await fetch(`${API_URL}/expediente/notas-progreso/${notaId}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!respuesta.ok && respuesta.status !== 204) {
                throw new Error(`Error ${respuesta.status}`)
            }

            await cargarNotas(selectedFichaForNotas.id)
            onRefresh?.()
        } catch (err) {
            console.error('Error al eliminar la nota de progreso:', err)
        } finally {
            setDeletingNotaId(null)
        }
    }

    const fichasOrdenadas = useMemo(() => {
        return [...fichas].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }, [fichas])

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                    <p className="text-gray-600 dark:text-gray-300 font-semibold">Fichas de ortodoncia registradas</p>
                </div>
                <Button color="purple" onClick={() => setOpenCreateModal(true)} disabled={!tieneAcceso}>
                    <div className="flex items-center gap-2">
                        <HiOutlinePlus size={16} />
                        Crear ficha
                    </div>
                </Button>
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-950 dark:text-red-200">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto rounded-lg shadow-sm">
                <Table hoverable className="text-center">
                    <TableHead>
                        <TableRow>
                            <TableHeadCell>Motivo inicial</TableHeadCell>
                            <TableHeadCell className="max-sm:hidden">Diagnóstico</TableHeadCell>
                            <TableHeadCell className="max-md:hidden">Oclusión</TableHeadCell>
                            <TableHeadCell className="max-md:hidden">Mordida</TableHeadCell>
                            <TableHeadCell className="max-lg:hidden">Plan de tratamiento</TableHeadCell>
                            <TableHeadCell className="max-lg:hidden">Estado</TableHeadCell>
                            <TableHeadCell>Creado</TableHeadCell>
                            <TableHeadCell>Notas</TableHeadCell>
                            <TableHeadCell>Editar</TableHeadCell>
                            <TableHeadCell>Eliminar</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y">
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center py-6 text-gray-500 dark:text-gray-300">
                                    Cargando fichas...
                                </TableCell>
                            </TableRow>
                        ) : fichasOrdenadas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center py-6 text-gray-500 dark:text-gray-300">
                                    No hay fichas registradas todavía.
                                </TableCell>
                            </TableRow>
                        ) : (
                            fichasOrdenadas.map((ficha) => (
                                <TableRow key={ficha.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {ficha.motivo_consulta_inicial || 'Sin motivo'}
                                    </TableCell>
                                    <TableCell className="max-sm:hidden">{ficha.diagnostico || 'Sin diagnóstico'}</TableCell>
                                    <TableCell className="max-md:hidden">{ficha.oclusion || '-'}</TableCell>
                                    <TableCell className="max-md:hidden">{ficha.mordida || '-'}</TableCell>
                                    <TableCell className="max-lg:hidden">{ficha.plan_tratamiento || '-'}</TableCell>
                                    <TableCell className="max-lg:hidden">{traducirEstado(ficha.estado_tratamiento)}</TableCell>
                                    <TableCell>{formatDate(ficha.created_at)}</TableCell>
                                    <TableCell>
                                        <HiOutlineDocumentText
                                            size={18}
                                            className="cursor-pointer text-gray-500 hover:text-gray-700 mx-auto"
                                            onClick={() => abrirModalNotas(ficha)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/fichas/editar/${ficha.id}`)}
                                            className="text-indigo-600 hover:text-indigo-800"
                                        >
                                            Editar
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <HiOutlineTrash
                                            size={18}
                                            className="cursor-pointer text-gray-500 hover:text-red-600 mx-auto"
                                            onClick={() => abrirModalEliminar(ficha)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Modal show={openDeleteModal} size="md" onClose={cerrarModalEliminar} popup position="center">
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-600 dark:text-gray-300">
                            ¿Eliminar la ficha creada el {formatDate(fichaSeleccionada?.created_at)}?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="red" onClick={confirmarEliminar}>
                                Eliminar
                            </Button>
                            <Button color="gray" onClick={cerrarModalEliminar}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

            <Modal show={openCreateModal} size="md" onClose={() => setOpenCreateModal(false)} popup position="center">
                <ModalBody className="pt-4  bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
                    <div className="text-left">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900  dark:text-white">Crear ficha de ortodoncia</h3>
                        <div className="flex flex-col gap-3">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="motivo_consulta">Motivo de consulta inicial</Label>
                                </div>
                                <TextInput
                                    id="motivo_consulta"
                                    type="text"
                                    placeholder="Motivo de consulta"
                                    value={newFicha.motivo_consulta_inicial}
                                    onChange={(e) => setNewFicha((prev) => ({ ...prev, motivo_consulta_inicial: e.target.value }))}
                                    shadow
                                    className=" text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="diagnostico">Diagnóstico</Label>
                                </div>
                                <TextInput
                                    id="diagnostico"
                                    type="text"
                                    placeholder="Diagnóstico"
                                    value={newFicha.diagnostico}
                                    onChange={(e) => setNewFicha((prev) => ({ ...prev, diagnostico: e.target.value }))}
                                    shadow
                                    className=" text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="oclusion">Oclusión</Label>
                                </div>
                                <TextInput
                                    id="oclusion"
                                    type="text"
                                    placeholder="Oclusión"
                                    value={newFicha.oclusion}
                                    onChange={(e) => setNewFicha((prev) => ({ ...prev, oclusion: e.target.value }))}
                                    shadow
                                    className=" text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="mordida">Mordida</Label>
                                </div>
                                <TextInput
                                    id="mordida"
                                    type="text"
                                    placeholder="Mordida"
                                    value={newFicha.mordida}
                                    onChange={(e) => setNewFicha((prev) => ({ ...prev, mordida: e.target.value }))}
                                    shadow
                                    className=" text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="plan_tratamiento">Plan de tratamiento</Label>
                                </div>
                                <Textarea
                                    id="plan_tratamiento"
                                    placeholder="Plan de tratamiento"
                                    rows={3}
                                    value={newFicha.plan_tratamiento}
                                    onChange={(e) => setNewFicha((prev) => ({ ...prev, plan_tratamiento: e.target.value }))}
                                    className="text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="estado_tratamiento">Estado del tratamiento</Label>
                                </div>
                                <Select
                                    id="estado_tratamiento"
                                    value={newFicha.estado_tratamiento}
                                    onChange={(e) => setNewFicha((prev) => ({ ...prev, estado_tratamiento: e.target.value }))}
                                    className="text-gray-900 dark:text-white"
                                >
                                    {ESTADO_TRATAMIENTO_OPCIONES.map((opcion) => (
                                        <option key={opcion.value} value={opcion.value}>
                                            {opcion.label}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <Button color="gray" onClick={() => {
                                setOpenCreateModal(false)
                                resetNuevaFicha()
                            }}>
                                Cancelar
                            </Button>
                            <Button color="purple" onClick={guardarNuevaFicha} isProcessing={savingFicha} disabled={savingFicha}>
                                Guardar ficha
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

            <Modal show={openNotesModal} size="lg" onClose={cerrarModalNotas} popup position="center">
                <ModalHeader />
                <ModalBody>
                    <div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">Notas de progreso</h3>
                                <div className="text-sm text-gray-500 dark:text-gray-300">
                                    Ficha: {selectedFichaForNotas?.motivo_consulta_inicial || selectedFichaForNotas?.id}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button color="purple" onClick={() => setOpenCreateNotaModal(true)} disabled={!selectedFichaForNotas}>
                                    Agregar nota
                                </Button>
                                <Button color="gray" onClick={cerrarModalNotas}>
                                    Cerrar
                                </Button>
                            </div>
                        </div>

                        {errorNotas && (
                            <div className="mb-3 rounded bg-red-100 p-3 text-red-700 dark:bg-red-950 dark:text-red-200">
                                {errorNotas}
                            </div>
                        )}

                        {loadingNotas ? (
                            <div className="py-6 text-center text-gray-500 dark:text-gray-300">Cargando notas...</div>
                        ) : notas.length === 0 ? (
                            <div className="py-6 text-center text-gray-500 dark:text-gray-300">No hay notas para esta ficha.</div>
                        ) : (
                            <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto px-1">
                                {notas.map((nota) => (
                                    <div key={nota.id} className="p-3 border rounded bg-white dark:bg-gray-900">
                                        <div className="flex justify-between items-start gap-3">
                                            <div>
                                                <div className="text-xs text-gray-400 dark:text-gray-500">{formatDate(nota.created_at)}</div>
                                                <div className="font-semibold text-gray-900 dark:text-gray-100">{nota.motivo_visita || 'Sin motivo'}</div>
                                                <div className="text-sm text-gray-700 dark:text-gray-200 mt-1">{nota.observaciones_clinicas || 'Sin observaciones'}</div>
                                                <div className="text-xs text-indigo-600 dark:text-indigo-300 mt-2">
                                                    Procedimiento: {nota.procedimiento_realizado || 'N/A'}
                                                </div>
                                                {nota.odontograma_comentarios && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                        Comentarios odontograma: {nota.odontograma_comentarios}
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                color="failure"
                                                size="xs"
                                                onClick={() => eliminarNota(nota.id)}
                                                isProcessing={deletingNotaId === nota.id}
                                                disabled={deletingNotaId === nota.id}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </ModalBody>
            </Modal>

            <Modal show={openCreateNotaModal} size="md" onClose={() => {
                setOpenCreateNotaModal(false)
                resetNuevaNota()
            }} popup position="center">
                <ModalHeader />
                <ModalBody>
                    <div className="text-left">
                        <h3 className="mb-3 text-lg font-semibold">Crear nota de progreso</h3>
                        <div className="flex flex-col gap-3">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="motivo_visita">Motivo de visita</Label>
                                </div>
                                <TextInput
                                    id="motivo_visita"
                                    type="text"
                                    placeholder="Motivo de la visita"
                                    value={newNota.motivo_visita}
                                    onChange={(e) => setNewNota((prev) => ({ ...prev, motivo_visita: e.target.value }))}
                                    shadow
                                    className="bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="observaciones_clinicas">Observaciones clínicas</Label>
                                </div>
                                <Textarea
                                    id="observaciones_clinicas"
                                    rows={3}
                                    placeholder="Observaciones clínicas"
                                    value={newNota.observaciones_clinicas}
                                    onChange={(e) => setNewNota((prev) => ({ ...prev, observaciones_clinicas: e.target.value }))}
                                    className="bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="procedimiento_realizado">Procedimiento realizado</Label>
                                </div>
                                <TextInput
                                    id="procedimiento_realizado"
                                    type="text"
                                    placeholder="Procedimiento realizado"
                                    value={newNota.procedimiento_realizado}
                                    onChange={(e) => setNewNota((prev) => ({ ...prev, procedimiento_realizado: e.target.value }))}
                                    shadow
                                    className="bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="odontograma_comentarios">Comentarios del odontograma (opcional)</Label>
                                </div>
                                <Textarea
                                    id="odontograma_comentarios"
                                    rows={2}
                                    placeholder="Comentarios sobre el odontograma"
                                    value={newNota.odontograma_comentarios}
                                    onChange={(e) => setNewNota((prev) => ({ ...prev, odontograma_comentarios: e.target.value }))}
                                    className="bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <Button color="gray" onClick={() => {
                                setOpenCreateNotaModal(false)
                                resetNuevaNota()
                            }}>
                                Cancelar
                            </Button>
                            <Button color="purple" onClick={guardarNuevaNota} isProcessing={savingNota} disabled={savingNota}>
                                Guardar nota
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    )
}

export default TableFichas