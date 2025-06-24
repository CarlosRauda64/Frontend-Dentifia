import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Alert, Button, Spinner } from "flowbite-react";
import { API_URL } from "../../api/api";
import { useAuth } from "../../auth/useAuth";
import Navegacion from "../Common/Navegacion";


const CancelarFactura = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cancelarFactura = async () => {
    try {
      const response = await fetch(`${API_URL}/facturacion/facturas/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
        body: JSON.stringify({ estado: "CANCELADA" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "No se pudo cancelar la factura");
      }

      navigate("/factura/historial");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    cancelarFactura();
  }, [id]);

  return (
    <Navegacion>
      <div className="max-w-2xl mx-auto p-6 mt-10">
        {loading && (
          <div className="text-center">
            <Spinner size="xl" color="info" />
            <p className="text-white mt-4">Cancelando factura...</p>
          </div>
        )}

        {!loading && error && (
          <Alert color="failure">
            <span className="font-medium">Error al cancelar la factura:</span>{" "}
            {error}
            <div className="mt-4 text-center">
              <Button color="gray" onClick={() => navigate("/factura/historial")}>
                Volver al historial
              </Button>
            </div>
          </Alert>
        )}
      </div>
    </Navegacion>
  );
};

export default CancelarFactura;
