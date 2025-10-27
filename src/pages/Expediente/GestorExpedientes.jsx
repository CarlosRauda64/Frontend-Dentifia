import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, TextInput, Badge, Tooltip } from 'flowbite-react'
import { HiOutlineFolderOpen, HiOutlinePlusCircle, HiSearch, HiRefresh } from 'react-icons/hi'
import { useNavigate } from 'react-router'
import Navegacion from '../Common/Navegacion.jsx'
import Loading from '../Common/Loading.jsx'
import { API_URL } from '../../api/api'
import { useAuth } from '../../auth/useAuth'

const buildExpedienteMap = (expedientes) => {
	const map = new Map()
	if (!Array.isArray(expedientes)) {
		return map
	}

	expedientes.forEach((expediente) => {
		const pacienteId = expediente?.paciente ?? expediente?.paciente_id ?? expediente?.paciente_detalle?.id
		if (pacienteId) {
			map.set(pacienteId, expediente)
		}
	})

	return map
}

const generarNumeroExpediente = (paciente) => {
	const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)
	const nombreBase = `${paciente.nombres ?? ''}${paciente.apellidos ?? ''}`
		.replace(/[^a-zA-Z]/g, '')
		.slice(0, 3)
		.toUpperCase()
	const prefijoPaciente = nombreBase || 'PAC'
	return `EXP-${prefijoPaciente}-${timestamp}`
}

const GestorExpedientes = () => {
	const auth = useAuth()
	const navigate = useNavigate()

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [pacientes, setPacientes] = useState([])
	const [expedientesPorPaciente, setExpedientesPorPaciente] = useState(new Map())
	const [search, setSearch] = useState('')
	const [creatingExpedienteId, setCreatingExpedienteId] = useState(null)

	const token = auth?.getAccessToken?.()

	const fetchPacientesYExpedientes = useCallback(async () => {
		if (!token) return

		setLoading(true)
		setError(null)

		try {
			const [pacientesRes, expedientesRes] = await Promise.all([
				fetch(`${API_URL}/pacientes/`, {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				}),
				fetch(`${API_URL}/expediente/expedientes/?expand=full`, {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				})
			])

			if (!pacientesRes.ok) {
				throw new Error(`Error al obtener pacientes (${pacientesRes.status})`)
			}

			if (!expedientesRes.ok) {
				throw new Error(`Error al obtener expedientes (${expedientesRes.status})`)
			}

			const pacientesData = await pacientesRes.json()
			const expedientesData = await expedientesRes.json()

			const pacientesLista = pacientesData?.results ?? pacientesData ?? []
			const expedientesLista = expedientesData?.results ?? expedientesData ?? []

			setPacientes(Array.isArray(pacientesLista) ? pacientesLista : [])
			setExpedientesPorPaciente(buildExpedienteMap(expedientesLista))
		} catch (err) {
			console.error('Error cargando pacientes y expedientes:', err)
			setError(err.message || 'Ocurrió un error al cargar la información.')
		} finally {
			setLoading(false)
		}
	}, [token])

	useEffect(() => {
		if (!auth?.isAuthenticated) return
		fetchPacientesYExpedientes()
	}, [auth?.isAuthenticated, fetchPacientesYExpedientes])

	const handleCrearExpediente = async (paciente) => {
		if (!token) return

		setCreatingExpedienteId(paciente.id)
		setError(null)

		try {
			const numeroExpediente = generarNumeroExpediente(paciente)
			const response = await fetch(`${API_URL}/expediente/expedientes/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					paciente: paciente.id,
					numero_expediente: numeroExpediente
				})
			})

			if (!response.ok) {
				const errorBody = await response.json().catch(() => ({}))
				throw new Error(errorBody?.detail || 'No se pudo crear el expediente.')
			}

			const nuevoExpediente = await response.json()
			await fetchPacientesYExpedientes()

			if (nuevoExpediente?.id) {
				navigate(`/expediente_paciente?expediente=${nuevoExpediente.id}`)
			}
		} catch (err) {
			console.error('Error al crear expediente:', err)
			setError(err.message || 'No se pudo crear el expediente. Intenta nuevamente.')
		} finally {
			setCreatingExpedienteId(null)
		}
	}

	const filteredPacientes = useMemo(() => {
		const term = search.trim().toLowerCase()
		if (!term) return pacientes
		return pacientes.filter((paciente) => {
			const nombreCompleto = `${paciente.nombres ?? ''} ${paciente.apellidos ?? ''}`.toLowerCase()
			return (
				nombreCompleto.includes(term) ||
				(paciente.dui ?? '').toLowerCase().includes(term) ||
				(paciente.telefono ?? '').toLowerCase().includes(term) ||
				(paciente.celular ?? '').toLowerCase().includes(term)
			)
		})
	}, [pacientes, search])

	return (
		<Navegacion>
			<div className="p-4 space-y-6">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<h1 className="text-2xl font-bold dark:text-white">Gestor de Expedientes</h1>
						<p className="text-sm text-gray-600 dark:text-gray-300">
							Busca un paciente, revisa su expediente o crea uno nuevo si aún no existe.
						</p>
					</div>
					<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
						<TextInput
							icon={HiSearch}
							placeholder="Buscar paciente por nombre, DUI o teléfono"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
						/>
						<Button color="light" onClick={fetchPacientesYExpedientes}>
							<HiRefresh className="mr-2 h-5 w-5" />
							Actualizar
						</Button>
					</div>
				</div>

				{error && (
					<div className="rounded-lg border border-red-300 bg-red-100 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-100">
						{error}
					</div>
				)}

				{loading ? (
					<div className="flex justify-center py-12">
						<Loading />
					</div>
				) : (
					<div className="overflow-x-auto rounded-xl bg-white shadow dark:bg-gray-800">
						<Table hoverable>
							<TableHead>
								<TableRow>
									<TableHeadCell>Paciente</TableHeadCell>
									<TableHeadCell className="max-md:hidden">DUI</TableHeadCell>
									<TableHeadCell>Teléfono</TableHeadCell>
									<TableHeadCell className="max-lg:hidden">Correo</TableHeadCell>
									<TableHeadCell>Expediente</TableHeadCell>
									<TableHeadCell>Acciones</TableHeadCell>
								</TableRow>
							</TableHead>
							<TableBody className="divide-y">
								{filteredPacientes.map((paciente) => {
									const expediente = expedientesPorPaciente.get(paciente.id) || null
									const tieneExpediente = Boolean(expediente?.id)
									return (
										<TableRow key={paciente.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
											<TableCell className="font-medium text-gray-900 dark:text-white">
												{paciente.nombres} {paciente.apellidos}
											</TableCell>
											<TableCell className="max-md:hidden">{paciente.dui || '—'}</TableCell>
											<TableCell>{paciente.telefono || paciente.celular || '—'}</TableCell>
											<TableCell className="max-lg:hidden">{paciente.email || '—'}</TableCell>
											<TableCell>
												{tieneExpediente ? (
													<Badge color="success" className="w-fit">
														#{expediente.numero_expediente ?? expediente.id}
													</Badge>
												) : (
													<Badge color="warning" className="w-fit">
														Sin expediente
													</Badge>
												)}
											</TableCell>
											<TableCell>
												{tieneExpediente ? (
													<Tooltip content="Abrir expediente clínico">
														<Button
															size="sm"
															color="blue"
															onClick={() => navigate(`/expediente_paciente?expediente=${expediente.id}`)}
														>
															<HiOutlineFolderOpen className="mr-2 h-5 w-5" />
															Ver expediente
														</Button>
													</Tooltip>
												) : (
													<Tooltip content="Crear nuevo expediente para este paciente">
														<Button
															size="sm"
															color="success"
															onClick={() => handleCrearExpediente(paciente)}
															isProcessing={creatingExpedienteId === paciente.id}
															disabled={creatingExpedienteId === paciente.id}
														>
															<HiOutlinePlusCircle className="mr-2 h-5 w-5" />
															Crear expediente
														</Button>
													</Tooltip>
												)}
											</TableCell>
										</TableRow>
									)
								})}

								{filteredPacientes.length === 0 && (
									<TableRow>
										<TableCell colSpan={6} className="text-center text-gray-500 dark:text-gray-400">
											No se encontraron pacientes que coincidan con la búsqueda.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				)}
			</div>
		</Navegacion>
	)
}

export default GestorExpedientes
