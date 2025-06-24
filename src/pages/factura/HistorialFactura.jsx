import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Card,
  Spinner,
  Alert,
  Button, Modal, ModalBody, ModalHeader
} from "flowbite-react";
import { useAuth } from "../../auth/useAuth";
import { API_URL } from "../../api/api";
import Navegacion from "../Common/Navegacion";
import { useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const HistorialFactura = () => {
  const [SelectId, setSelectId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleOpenModal = (id) => {
    setSelectId(id);
    setOpenModal(true);
  };

  const eliminarFactura = async (id) => {
    try {
      const response = await fetch(`${API_URL}/facturacion/eliminar/${id}/`, {
        method: "DELETE",
        headers: {
          'Content-Type': "application/json",
          'Authorization': `Bearer ${auth.getAccessToken()}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al eliminar la factura");
      }
      fetchFacturas();
    } catch (error) {
      setError("Error desconocido", error.message || "Error al eliminar la factura");
    } finally {
      setOpenModal(false);
    }
  };

  const fetchFacturas = async () => {
    try {
      const response = await fetch(`${API_URL}/facturacion/facturas/`, {
        headers: {
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener facturas");
      }

      const data = await response.json();
      setFacturas(data);
    } catch (err) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacturas();
  }, []);

  return (
    <Navegacion>
      <div className="p-6 max-w-6xl mx-auto text-white">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-cyan-400">
          📄 Historial de Facturas
        </h1>

        {loading && <Spinner size="xl" className="mx-auto" color="info" />}

        {error && <Alert color="failure">{error}</Alert>}

        {!loading && !error && facturas.length === 0 && (
          <Alert color="info">No hay facturas registradas.</Alert>
        )}

        {!loading && !error && facturas.length > 0 && (
          <div className="flex flex-col gap-6">
            {facturas.map((factura, i) => (
              <Card
                key={`${factura.idfactura}-${i}`}
                className="bg-gradient-to-br from-gray-800 to-gray-900 text-white border border-cyan-600 shadow-xl"
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold text-cyan-300">
                    🧾 Factura #{factura.idfactura}
                  </h2>

                  <div className="flex gap-2">

                    {factura.estado !== "CANCELADA" && (
                      <Button
                        color="blue"
                        size="xs"
                        onClick={() => navigate(`/factura/editar/${factura.idfactura}`)}
                      >
                        Editar
                      </Button>
                    )}

                    {factura.estado !== "CANCELADA" && (
                      <Button
                        color="red"
                        size="xs"
                        onClick={() =>
                          handleOpenModal(factura.idfactura)
                        }
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>

                <div className="text-sm space-y-1">
                  <p>
                    <strong className="text-cyan-400">Fecha:</strong>{" "}
                    {factura.fecha_emision}
                  </p>
                  <p>
                    <strong className="text-cyan-400">Método de Pago:</strong>{" "}
                    {factura.metodo_pago}
                  </p>
                  <p>
                    <strong className="text-cyan-400">Estado:</strong>{" "}
                    <span
                      className={`font-semibold ${factura.estado === "CANCELADA"
                        ? "text-red-500"
                        : factura.estado === "PENDIENTE"
                          ? "text-yellow-400"
                          : "text-green-400"
                        }`}
                    >
                      {factura.estado}
                    </span>
                  </p>
                  <p>
                    <strong className="text-cyan-400">Monto Total:</strong> $
                    {factura.monto_total}
                  </p>
                </div>

                <div className="mt-4">
                  <h3 className="font-medium mb-2 text-cyan-400">
                    📋 Detalles:
                  </h3>
                  <Table striped hoverable>
                    <TableHead className="bg-cyan-800 text-white">
                      <TableRow>
                        <TableHeadCell>Descripción</TableHeadCell>
                        <TableHeadCell>Precio Unitario</TableHeadCell>
                        <TableHeadCell>Cantidad</TableHeadCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {factura.detalles?.map((detalle, index) => (
                        <TableRow
                          key={index}
                          className="bg-gray-700 hover:bg-gray-600 text-white"
                        >
                          <TableCell>{detalle.descripcion}</TableCell>
                          <TableCell>${detalle.precio_unitario}</TableCell>
                          <TableCell>{detalle.cantidad}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Deseas cancelar esta factura?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="green" onClick={() => eliminarFactura(SelectId)}>
                ACEPTAR
              </Button>
              <Button color="red" onClick={() => setOpenModal(false)}>
                CANCELAR
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </Navegacion>
  );
};

export default HistorialFactura;
