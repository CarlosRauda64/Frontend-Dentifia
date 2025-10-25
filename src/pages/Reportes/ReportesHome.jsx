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

  // Determinar qué filtros mostrar según el tipo de reporte
  const showDateFilters = selectedReportType && selectedReportType !== ReportType.STOCK_INSUMOS;
  const showPacienteFilter = selectedReportType === ReportType.HISTORIAL_CLINICO;

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

  // Función para generar reporte
  const handleGenerateReport = useCallback(async () => {
    if (!selectedReportType) return;
    
    setError(null);
    setIsLoading(true);
    
    try {
      const effectiveFromDate = showDateFilters ? fromDate : '1970-01-01';
      const effectiveToDate = showDateFilters ? toDate : new Date().toISOString().split('T')[0];

      const accessToken = auth.getAccessToken();
      const data = await generateReport(
        selectedReportType,
        effectiveFromDate,
        effectiveToDate,
        showPacienteFilter ? selectedPacienteId : undefined,
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
  }, [selectedReportType, fromDate, toDate, selectedPacienteId, showDateFilters, showPacienteFilter, auth]);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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