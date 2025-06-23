import { useState, useEffect } from 'react';
import { Table, Button, TextInput } from "flowbite-react";
import Navegacion from '../Common/Navegacion';
import { useAuth } from '../../auth/useAuth';
import { API_URL } from '../../api/api';
import { useNavigate } from 'react-router-dom';

const HistorialFactura = () => {
  const [facturas, setFacturas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const response = await fetch(`${API_URL}/facturacion/facturas/`, {
          headers: {
            'Authorization': `Bearer ${auth.getAccessToken()}`
          }
        });
        const data = await response.json();
        setFacturas(data);
      } catch (error) {
        console.error("Error cargando facturas:", error);
      }
    };

    fetchFacturas();
  }, [auth]);

  const filtrarFacturas = facturas.filter(f =>
    f.paciente.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Navegacion>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">Historial de Facturas</h1>
        <TextInput
          placeholder="Buscar por nombre del paciente"
          className="mb-4"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        <Table striped hoverable>
          <Table.Head>
            <Table.HeadCell>Paciente</Table.HeadCell>
            <Table.HeadCell>Monto</Table.HeadCell>
            <Table.HeadCell>Descuento</Table.HeadCell>
            <Table.HeadCell>Estado</Table.HeadCell>
            <Table.HeadCell>Acciones</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {filtrarFacturas.map((factura) => (
              <Table.Row key={factura.id}>
                <Table.Cell>{factura.paciente}</Table.Cell>
                <Table.Cell>${factura.monto}</Table.Cell>
                <Table.Cell>{factura.descuento}%</Table.Cell>
                <Table.Cell>{factura.estado}</Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Button size="xs" onClick={() => navigate(`/factura/editar/${factura.id}`)}>Editar</Button>
                    {factura.estado !== "Cancelada" && (
                      <Button size="xs" color="failure" onClick={() => navigate(`/factura/cancelar/${factura.id}`)}>Cancelar</Button>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </Navegacion>
  );
};

export default HistorialFactura;
