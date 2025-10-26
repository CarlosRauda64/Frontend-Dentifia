// ...existing code...
import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    Modal,
    ModalBody,
    ModalHeader,
    Button,
    Datepicker
} from "flowbite-react";
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlineExclamationCircle, HiOutlinePlus } from "react-icons/hi";
import { useNavigate } from "react-router";

const mockFichas = [
    {
        id: 1,
        motivo_consulta: "Dolor en molares superiores",
        diagnostico: "Caries profunda en 16 y 15",
        oclusion: "Clase I",
        mordida: "Mordida normal",
        plan_tratamiento: "Obturación 16, 15 + control a 6 meses",
        estado_tratamiento: "Pendiente",
        created_at: "2025-10-01T10:15:00Z",
    },
    {
        id: 2,
        motivo_consulta: "Malposición dental",
        diagnostico: "Apiñamiento leve en arcada superior",
        oclusion: "Clase II",
        mordida: "Mordida cruzada parcial",
        plan_tratamiento: "Brackets superiores 12 meses",
        estado_tratamiento: "En tratamiento",
        created_at: "2025-09-15T14:30:00Z",
    },
    {
        id: 3,
        motivo_consulta: "Revisión rutinaria",
        diagnostico: "Sin hallazgos relevantes",
        oclusion: "Clase I",
        mordida: "Mordida normal",
        plan_tratamiento: "Profilaxis + pulido",
        estado_tratamiento: "Completado",
        created_at: "2025-08-20T09:00:00Z",
    },
];

const TableFichas = () => {
    const [fichas, setFichas] = useState(mockFichas);
    const [fichaSeleccionada, setFichaSeleccionada] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [newFicha, setNewFicha] = useState({
        motivo_consulta_inicial: "",
        diagnostico: "",
        oclusion: "",
        mordida: "",
        plan_tratamiento: "",
        estado_tratamiento: "",
    });
    const navigate = useNavigate();

    const formatDate = (iso) => {
        if (!iso) return "";
        try {
            const d = new Date(iso);
            return d.toLocaleString();
        } catch {
            return iso;
        }
    };

    const abrirModalEliminar = (f) => {
        setFichaSeleccionada(f);
        setOpenModal(true);
    };

    const cancelarModal = () => {
        setOpenModal(false);
        setFichaSeleccionada(null);
    };

    const confirmarEliminar = () => {
        if (!fichaSeleccionada) return;
        setFichas((prev) => prev.filter((f) => f.id !== fichaSeleccionada.id));
        setOpenModal(false);
        setFichaSeleccionada(null);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col justify-center items-center md:flex-row md:space-x-2">
                    <p className="text-gray-600 dark:text-gray-300 font-bold">Busqueda por fecha:</p>
                    <Datepicker language="es-MX"/>
                </div>
                <Button color="purple" onClick={() => setOpenCreateModal(true)}>
                    <div className="flex items-center gap-2">
                        <HiOutlinePlus size={16} />
                        Crear ficha
                    </div>
                </Button>
            </div>
            <div className="overflow-x-auto">
                <Table hoverable className="text-center">
                    <TableHead>
                        <TableRow>
                            <TableHeadCell>Motivo</TableHeadCell>
                            <TableHeadCell className="max-sm:hidden">Diagnóstico</TableHeadCell>
                            <TableHeadCell className="max-md:hidden">Oclusión</TableHeadCell>
                            <TableHeadCell className="max-md:hidden">Mordida</TableHeadCell>
                            <TableHeadCell className="max-lg:hidden">Plan tratamiento</TableHeadCell>
                            <TableHeadCell className="max-lg:hidden">Estado</TableHeadCell>
                            <TableHeadCell>Creado</TableHeadCell>
                            <TableHeadCell>Editar</TableHeadCell>
                            <TableHeadCell>Eliminar</TableHeadCell>
                        </TableRow>
                    </TableHead>

                    <TableBody className="divide-y">
                        {fichas.map((f) => (
                            <TableRow key={f.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {f.motivo_consulta ?? ""}
                                </TableCell>
                                <TableCell className="max-sm:hidden">{f.diagnostico ?? ""}</TableCell>
                                <TableCell className="max-md:hidden">{f.oclusion ?? ""}</TableCell>
                                <TableCell className="max-md:hidden">{f.mordida ?? ""}</TableCell>
                                <TableCell className="max-lg:hidden">{f.plan_tratamiento ?? ""}</TableCell>
                                <TableCell className="max-lg:hidden">{f.estado_tratamiento ?? ""}</TableCell>
                                <TableCell>{formatDate(f.created_at)}</TableCell>
                                <TableCell>
                                    <HiOutlinePencilAlt
                                        size={18}
                                        className="cursor-pointer text-gray-500 hover:text-gray-700 mx-auto"
                                        onClick={() => navigate(`/fichas/editar/${f.id}`)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <HiOutlineTrash
                                        size={18}
                                        className="cursor-pointer text-gray-500 hover:text-gray-700 mx-auto"
                                        onClick={() => abrirModalEliminar(f)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {openModal && fichaSeleccionada && (
                <Modal show={openModal} size="md" onClose={cancelarModal} popup position="center">
                    <ModalHeader />
                    <ModalBody>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                ¿Eliminar ficha creada el{" "}
                                <span className="font-semibold">{formatDate(fichaSeleccionada.created_at)}</span>?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="red" onClick={confirmarEliminar}>
                                    Eliminar
                                </Button>
                                <Button color="gray" onClick={cancelarModal}>
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            )}

            {/* Create ficha modal (UI only, no backend yet) */}
            <Modal show={openCreateModal} size="md" onClose={() => setOpenCreateModal(false)} popup position="center">
                <ModalHeader />
                <ModalBody>
                    <div className="text-left">
                        <h3 className="mb-4 text-lg font-semibold">Crear ficha de ortodoncia</h3>
                        <div className="flex flex-col gap-3">
                            <label className="text-sm">Motivo de consulta</label>
                            <input
                                type="text"
                                value={newFicha.motivo_consulta_inicial}
                                onChange={(e) => setNewFicha((s) => ({ ...s, motivo_consulta_inicial: e.target.value }))}
                                className="w-full rounded border px-2 py-1"
                                placeholder="Motivo de consulta inicial"
                            />

                            <label className="text-sm">Diagnóstico</label>
                            <input
                                type="text"
                                value={newFicha.diagnostico}
                                onChange={(e) => setNewFicha((s) => ({ ...s, diagnostico: e.target.value }))}
                                className="w-full rounded border px-2 py-1"
                                placeholder="Diagnóstico"
                            />

                            <label className="text-sm">Oclusión</label>
                            <input
                                type="text"
                                value={newFicha.oclusion}
                                onChange={(e) => setNewFicha((s) => ({ ...s, oclusion: e.target.value }))}
                                className="w-full rounded border px-2 py-1"
                                placeholder="Clase I / II / III"
                            />

                            <label className="text-sm">Mordida</label>
                            <input
                                type="text"
                                value={newFicha.mordida}
                                onChange={(e) => setNewFicha((s) => ({ ...s, mordida: e.target.value }))}
                                className="w-full rounded border px-2 py-1"
                                placeholder="Abierta / Cruzada / Normal"
                            />

                            <label className="text-sm">Plan de tratamiento</label>
                            <textarea
                                value={newFicha.plan_tratamiento}
                                onChange={(e) => setNewFicha((s) => ({ ...s, plan_tratamiento: e.target.value }))}
                                className="w-full rounded border px-2 py-1"
                                rows={3}
                                placeholder="Plan de tratamiento"
                            />

                            <label className="text-sm">Estado</label>
                            <input
                                type="text"
                                value={newFicha.estado_tratamiento}
                                onChange={(e) => setNewFicha((s) => ({ ...s, estado_tratamiento: e.target.value }))}
                                className="w-full rounded border px-2 py-1"
                                placeholder="Activo / Finalizado / Cancelado"
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <Button color="gray" onClick={() => setOpenCreateModal(false)}>
                                Cancelar
                            </Button>
                            <Button color="purple" onClick={() => {
                                // UI-only: placeholder save action (no backend). Close modal.
                                // You can later replace this with real API call and state update.
                                // eslint-disable-next-line no-console
                                console.log('Crear ficha (UI-only):', newFicha);
                                setOpenCreateModal(false);
                                setNewFicha({ motivo_consulta_inicial: '', diagnostico: '', oclusion: '', mordida: '', plan_tratamiento: '', estado_tratamiento: '' });
                            }}>
                                Guardar (no funcional)
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};

export default TableFichas;