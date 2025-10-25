import React, { useState, useCallback, useEffect } from 'react';
import { Button, TextInput, Select, Alert, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Badge, Spinner } from 'flowbite-react';
import { HiSearch, HiDownload, HiDocumentReport, HiExclamation, HiCalendar } from 'react-icons/hi';
import Navegacion from '../Common/Navegacion';
import { generateReport, getPacientes } from '../../services/reportService';
import { ReportType } from '../../types/reportTypes';
import { useAuth } from '../../auth/useAuth';

const ReportesHome = () => {
  const auth = useAuth();
  
  // Estados principales
  const [selectedReportType, setSelectedReportType] = useState('');
  const [fromDate, setFromDate] = useState(() => 
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [toDate, setToDate] = useState(() => 
    new Date().toISOString().split('T')[0]
  );
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para filtros
  const [pacientes, setPacientes] = useState([]);
  const [selectedPacienteId, setSelectedPacienteId] = useState('');
  
  // Filtros específicos por reporte
  // Pacientes
  const [filterSexo, setFilterSexo] = useState('');
  const [filterRangoEdad, setFilterRangoEdad] = useState('');
  const [filterBusquedaNombre, setFilterBusquedaNombre] = useState('');
  
  // Facturación
  const [filterEstadoFactura, setFilterEstadoFactura] = useState('');
  const [filterMetodoPago, setFilterMetodoPago] = useState('');
  const [filterMontoMinimo, setFilterMontoMinimo] = useState('');
  const [filterMontoMaximo, setFilterMontoMaximo] = useState('');
  const [filterPacienteFactura, setFilterPacienteFactura] = useState('');
  
  // Stock
  const [filterStockBajo, setFilterStockBajo] = useState(false);
  const [filterBusquedaInsumo, setFilterBusquedaInsumo] = useState('');
  
  // Movimientos
  const [filterTipoMovimiento, setFilterTipoMovimiento] = useState('');
  const [filterEstadoMovimiento, setFilterEstadoMovimiento] = useState('');
  const [filterUsuarioMovimiento, setFilterUsuarioMovimiento] = useState('');
  const [filterBusquedaInsumoMov, setFilterBusquedaInsumoMov] = useState('');

  // Determinar qué filtros mostrar según el tipo de reporte
  const showDateFilters = selectedReportType && selectedReportType !== ReportType.STOCK_INSUMOS;
  const showPacienteFilter = selectedReportType === ReportType.HISTORIAL_CLINICO;

  // Función para generar reporte
  const handleGenerateReport = useCallback(async () => {
    if (!selectedReportType) return;
    
    setError(null);
    setIsLoading(true);
    
    try {
      const effectiveFromDate = showDateFilters ? fromDate : '1970-01-01';
      const effectiveToDate = showDateFilters ? toDate : new Date().toISOString().split('T')[0];

      // Preparar filtros según el tipo de reporte
      let filters = {};
      
      if (selectedReportType === ReportType.PACIENTES) {
        filters = {
          sexo: filterSexo,
          rangoEdad: filterRangoEdad,
          busquedaNombre: filterBusquedaNombre
        };
      } else if (selectedReportType === ReportType.FACTURACION) {
        filters = {
          estadoFactura: filterEstadoFactura,
          metodoPago: filterMetodoPago,
          montoMinimo: filterMontoMinimo,
          montoMaximo: filterMontoMaximo,
          pacienteId: filterPacienteFactura
        };
      } else if (selectedReportType === ReportType.STOCK_INSUMOS) {
        filters = {
          stockBajo: filterStockBajo,
          busquedaInsumo: filterBusquedaInsumo
        };
      } else if (selectedReportType === ReportType.MOVIMIENTOS_INVENTARIO) {
        filters = {
          tipoMovimiento: filterTipoMovimiento,
          estadoMovimiento: filterEstadoMovimiento,
          usuarioMovimiento: filterUsuarioMovimiento,
          busquedaInsumo: filterBusquedaInsumoMov
        };
      }

      const accessToken = auth.getAccessToken();
      const data = await generateReport(
        selectedReportType,
        effectiveFromDate,
        effectiveToDate,
        filters,
        accessToken
      );
      
      setReportData(data);
    } catch (err) {
      console.error("Error generando reporte:", err);
      setError(err.message || "Ocurrió un error al generar el reporte. Intente nuevamente.");
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedReportType, fromDate, toDate, selectedPacienteId, showDateFilters, showPacienteFilter, auth,
    // Filtros de pacientes
    filterSexo, filterRangoEdad, filterBusquedaNombre,
    // Filtros de facturación
    filterEstadoFactura, filterMetodoPago, filterMontoMinimo, filterMontoMaximo, filterPacienteFactura,
    // Filtros de stock
    filterStockBajo, filterBusquedaInsumo,
    // Filtros de movimientos
    filterTipoMovimiento, filterEstadoMovimiento, filterUsuarioMovimiento, filterBusquedaInsumoMov
  ]);

  // Cargar pacientes al montar el componente
  useEffect(() => {
    const loadPacientes = async () => {
      try {
        const accessToken = auth.getAccessToken();
        const pacientesData = await getPacientes(accessToken);
        setPacientes(pacientesData);
      } catch (error) {
        console.error('Error cargando pacientes:', error);
      }
    };
    loadPacientes();
  }, [auth]);

  // Regenerar reporte automáticamente al cambiar filtros (solo para búsquedas de texto)
  useEffect(() => {
    if (reportData && selectedReportType) {
      // Solo regenerar automáticamente para campos de búsqueda de texto
      const textSearchFields = [filterBusquedaNombre, filterBusquedaInsumo, filterBusquedaInsumoMov, filterUsuarioMovimiento];
      const hasTextSearch = textSearchFields.some(field => field && field.trim() !== '');
      
      if (hasTextSearch) {
        const timer = setTimeout(() => {
          handleGenerateReport();
        }, 300); // Debounce para búsquedas de texto
        return () => clearTimeout(timer);
      }
    }
  }, [
    // Solo filtros de búsqueda de texto
    filterBusquedaNombre, filterBusquedaInsumo, filterBusquedaInsumoMov, filterUsuarioMovimiento,
    // Dependencias de la función (sin reportData para evitar bucle)
    handleGenerateReport, selectedReportType
  ]);

  // Función para descargar PDF
  const handleDownloadPDF = () => {
    if (!reportData) return;
    
    // Importar dinámicamente las librerías de PDF
    import('jspdf').then(({ default: jsPDF }) => {
      import('jspdf-autotable').then(({ default: autoTable }) => {
        const doc = new jsPDF();
        
        // Título del reporte
        doc.setFontSize(16);
        doc.text(reportData.nombreReporte, 14, 22);
        
        // Información del reporte
        doc.setFontSize(10);
        doc.text(`ID: ${reportData.id}`, 14, 30);
        doc.text(`Generado: ${new Date(reportData.fecha_generacion).toLocaleString()}`, 14, 35);
        doc.text(`Período: ${reportData.desde} - ${reportData.hasta}`, 14, 40);
        
        // Preparar datos para la tabla
        const columns = Object.keys(reportData.rows[0] || {});
        const tableData = reportData.rows.map(row => 
          columns.map(col => row[col] || '')
        );
        
        // Generar tabla
        autoTable(doc, {
          head: [columns],
          body: tableData,
          startY: 50,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [59, 130, 246] }
        });
        
        // Descargar
        const fileName = `${reportData.nombreReporte.replace(/\s+/g, '_')}_${reportData.id}.pdf`;
        doc.save(fileName);
      });
    });
  };

  return (
    <Navegacion>
      <div className="p-4 max-sm:pt-20 max-sm:px-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold dark:text-gray-200">Módulo de Reportes</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="w-full sm:w-auto"
            >
              <option value="">Seleccionar tipo de reporte</option>
              <option value={ReportType.PACIENTES}>Listado de Pacientes</option>
              <option value={ReportType.CITAS}>Reporte de Citas *</option>
              <option value={ReportType.HISTORIAL_CLINICO}>Historial Clínico *</option>
              <option value={ReportType.FACTURACION}>Reporte de Facturación</option>
              <option value={ReportType.ENCUESTAS_SATISFACCION}>Encuestas de Satisfacción *</option>
              <option value={ReportType.STOCK_INSUMOS}>Stock de Insumos</option>
              <option value={ReportType.MOVIMIENTOS_INVENTARIO}>Movimientos de Inventario</option>
            </Select>
            <Button 
              onClick={handleGenerateReport}
              disabled={!selectedReportType || isLoading}
              color="blue"
            >
              {isLoading ? <Spinner size="sm" /> : 'Generar Reporte'}
            </Button>
          </div>
        </div>

        {/* Leyenda de asteriscos */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Nota:</span> Los reportes marcados con (*) utilizan datos de demostración ya que sus módulos correspondientes aún no están implementados en el backend.
          </p>
        </div>

        {/* Filtros */}
        {selectedReportType && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Filtros de fechas (para reportes que los necesiten) */}
              {showDateFilters && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Desde</label>
                    <TextInput
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      icon={HiCalendar}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Hasta</label>
                    <TextInput
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      icon={HiCalendar}
                    />
                  </div>
                </>
              )}
              
              {/* Filtro de paciente para historial clínico */}
              {showPacienteFilter && (
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">Paciente</label>
                  <Select
                    value={selectedPacienteId}
                    onChange={(e) => setSelectedPacienteId(e.target.value)}
                  >
                    <option value="">Seleccionar paciente</option>
                    {pacientes.map(paciente => (
                      <option key={paciente.id} value={paciente.id}>
                        {paciente.nombre}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              {/* Filtros específicos para Listado de Pacientes */}
              {selectedReportType === ReportType.PACIENTES && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Buscar por nombre</label>
                    <TextInput
                      placeholder="Nombre o apellido..."
                      value={filterBusquedaNombre}
                      onChange={(e) => setFilterBusquedaNombre(e.target.value)}
                      icon={HiSearch}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Sexo</label>
                    <Select
                      value={filterSexo}
                      onChange={(e) => setFilterSexo(e.target.value)}
                    >
                      <option value="">Todos los sexos</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                      <option value="X">Otro</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Rango de edad</label>
                    <Select
                      value={filterRangoEdad}
                      onChange={(e) => setFilterRangoEdad(e.target.value)}
                    >
                      <option value="">Todas las edades</option>
                      <option value="0-18">0-18 años</option>
                      <option value="19-35">19-35 años</option>
                      <option value="36-50">36-50 años</option>
                      <option value="51-65">51-65 años</option>
                      <option value="65+">65+ años</option>
                    </Select>
                  </div>
                </>
              )}

              {/* Filtros específicos para Reporte de Facturación */}
              {selectedReportType === ReportType.FACTURACION && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Estado</label>
                    <Select
                      value={filterEstadoFactura}
                      onChange={(e) => setFilterEstadoFactura(e.target.value)}
                    >
                      <option value="">Todos los estados</option>
                      <option value="PAGADA">Pagada</option>
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="CANCELADA">Cancelada</option>
                      <option value="ACEPTADA">Aceptada</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Método de pago</label>
                    <Select
                      value={filterMetodoPago}
                      onChange={(e) => setFilterMetodoPago(e.target.value)}
                    >
                      <option value="">Todos los métodos</option>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta">Tarjeta</option>
                      <option value="Transferencia">Transferencia</option>
                      <option value="Cheque">Cheque</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Monto mínimo</label>
                    <TextInput
                      type="number"
                      placeholder="0.00"
                      value={filterMontoMinimo}
                      onChange={(e) => setFilterMontoMinimo(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Monto máximo</label>
                    <TextInput
                      type="number"
                      placeholder="999999.99"
                      value={filterMontoMaximo}
                      onChange={(e) => setFilterMontoMaximo(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Paciente</label>
                    <Select
                      value={filterPacienteFactura}
                      onChange={(e) => setFilterPacienteFactura(e.target.value)}
                    >
                      <option value="">Todos los pacientes</option>
                      {pacientes.map(paciente => (
                        <option key={paciente.id} value={paciente.id}>
                          {paciente.nombre}
                        </option>
                      ))}
                    </Select>
                  </div>
                </>
              )}

              {/* Filtros específicos para Stock de Insumos */}
              {selectedReportType === ReportType.STOCK_INSUMOS && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Buscar insumo</label>
                    <TextInput
                      placeholder="Nombre o descripción..."
                      value={filterBusquedaInsumo}
                      onChange={(e) => setFilterBusquedaInsumo(e.target.value)}
                      icon={HiSearch}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="stockBajo"
                      checked={filterStockBajo}
                      onChange={(e) => setFilterStockBajo(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="stockBajo" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Solo stock bajo (&lt; 10)
                    </label>
                  </div>
                </>
              )}

              {/* Filtros específicos para Movimientos de Inventario */}
              {selectedReportType === ReportType.MOVIMIENTOS_INVENTARIO && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Tipo de movimiento</label>
                    <Select
                      value={filterTipoMovimiento}
                      onChange={(e) => setFilterTipoMovimiento(e.target.value)}
                    >
                      <option value="">Todos los tipos</option>
                      <option value="entrada">Entrada</option>
                      <option value="salida">Salida</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Estado</label>
                    <Select
                      value={filterEstadoMovimiento}
                      onChange={(e) => setFilterEstadoMovimiento(e.target.value)}
                    >
                      <option value="">Todos los estados</option>
                      <option value="realizado">Realizado</option>
                      <option value="cancelado">Cancelado</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Usuario</label>
                    <TextInput
                      placeholder="Nombre de usuario..."
                      value={filterUsuarioMovimiento}
                      onChange={(e) => setFilterUsuarioMovimiento(e.target.value)}
                      icon={HiSearch}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Buscar insumo</label>
                    <TextInput
                      placeholder="Nombre del insumo..."
                      value={filterBusquedaInsumoMov}
                      onChange={(e) => setFilterBusquedaInsumoMov(e.target.value)}
                      icon={HiSearch}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert color="failure" icon={HiExclamation} className="mb-6">
            {error}
          </Alert>
        )}

        {/* Reporte */}
        {reportData && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {/* Header del reporte */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold dark:text-gray-200">{reportData.nombreReporte}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ID: {reportData.id} | Generado: {new Date(reportData.fecha_generacion).toLocaleString()}
                  </p>
                </div>
                <Button onClick={handleDownloadPDF} color="blue" size="sm">
                  <HiDownload className="mr-2 h-4 w-4" />
                  Descargar PDF
                </Button>
              </div>
            </div>

            {/* Información del reporte */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium dark:text-gray-300">Período:</span>
                  <p className="text-gray-600 dark:text-gray-400">{reportData.desde} - {reportData.hasta}</p>
                </div>
                {reportData.total_pacientes && (
                  <div>
                    <span className="font-medium dark:text-gray-300">Total Pacientes:</span>
                    <p className="text-gray-600 dark:text-gray-400">{reportData.total_pacientes}</p>
                  </div>
                )}
                {reportData.total_citas && (
                  <div>
                    <span className="font-medium dark:text-gray-300">Total Citas:</span>
                    <p className="text-gray-600 dark:text-gray-400">{reportData.total_citas}</p>
                  </div>
                )}
                {reportData.total_facturas && (
                  <div>
                    <span className="font-medium dark:text-gray-300">Total Facturas:</span>
                    <p className="text-gray-600 dark:text-gray-400">{reportData.total_facturas}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tabla de datos */}
            <div className="overflow-x-auto">
              <Table hoverable>
                <TableHead>
                  <TableRow>
                    {reportData.rows.length > 0 && Object.keys(reportData.rows[0]).map((key, index) => (
                      <TableHeadCell key={index} className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </TableHeadCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                  {reportData.rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      {Object.values(row).map((value, colIndex) => (
                        <TableCell key={colIndex} className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {value || '-'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Estado inicial */}
        {!reportData && !isLoading && !error && (
          <div className="text-center py-12">
            <HiDocumentReport className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">
              Selecciona un tipo de reporte
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Elige el tipo de reporte que deseas generar y configura los filtros necesarios.
            </p>
          </div>
        )}
      </div>
    </Navegacion>
  );
};

export default ReportesHome;