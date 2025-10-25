import React, { useState, useCallback, useEffect } from 'react';
import { Alert } from 'flowbite-react';
import { HiExclamation } from 'react-icons/hi';
import ReportSelector from './components/ReportSelector';
import ReportViewer from './components/ReportViewer';
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

  // Estados para filtros condicionales
  const [showDateFilters, setShowDateFilters] = useState(true);
  const [showPacienteFilter, setShowPacienteFilter] = useState(false);
  const [selectedPacienteId, setSelectedPacienteId] = useState('');
  const [pacientes, setPacientes] = useState([]);

  // Opciones de reportes disponibles
  const reportOptions = [
    { value: ReportType.CITAS, label: ReportType.CITAS },
    { value: ReportType.PACIENTES, label: ReportType.PACIENTES },
    { value: ReportType.HISTORIAL_CLINICO, label: ReportType.HISTORIAL_CLINICO },
    { value: ReportType.FACTURACION, label: ReportType.FACTURACION },
    { value: ReportType.ENCUESTAS_SATISFACCION, label: ReportType.ENCUESTAS_SATISFACCION },
    { value: ReportType.STOCK_INSUMOS, label: ReportType.STOCK_INSUMOS },
    { value: ReportType.MOVIMIENTOS_INVENTARIO, label: ReportType.MOVIMIENTOS_INVENTARIO },
  ];

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

  // Configurar filtros según el tipo de reporte seleccionado
  useEffect(() => {
    setReportData(null);
    setError(null);
    setSelectedPacienteId('');

    if (selectedReportType) {
      switch (selectedReportType) {
        case ReportType.PACIENTES:
          setShowDateFilters(true);
          setShowPacienteFilter(false);
          break;
        case ReportType.STOCK_INSUMOS:
          setShowDateFilters(false);
          setShowPacienteFilter(false);
          break;
        case ReportType.HISTORIAL_CLINICO:
          setShowDateFilters(true);
          setShowPacienteFilter(true);
          break;
        default: // CITAS, FACTURACION, ENCUESTAS, MOVIMIENTOS_INVENTARIO
          setShowDateFilters(true);
          setShowPacienteFilter(false);
          break;
      }
    } else {
      setShowDateFilters(true);
      setShowPacienteFilter(false);
    }
  }, [selectedReportType]);

  // Función para generar reporte
  const handleGenerateReport = useCallback(async () => {
    setError(null);

    // Validaciones
    if (!selectedReportType) {
      setError("Por favor, seleccione un tipo de reporte.");
      setReportData(null);
      return;
    }
    
    if (showDateFilters) {
      if (!fromDate || !toDate) {
        setError("Por favor, seleccione las fechas 'Desde' y 'Hasta'.");
        setReportData(null);
        return;
      }
      if (new Date(fromDate) > new Date(toDate)) {
        setError("La fecha 'Desde' no puede ser posterior a la fecha 'Hasta'.");
        setReportData(null);
        return;
      }
    }
    
    if (showPacienteFilter && !selectedPacienteId) {
      setError("Por favor, seleccione un paciente para este tipo de reporte.");
      setReportData(null);
      return;
    }

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
  }, [selectedReportType, fromDate, toDate, selectedPacienteId, showDateFilters, showPacienteFilter]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-2">
          Módulo de Reportes
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Genera reportes detallados de pacientes, facturación, inventario y más
        </p>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto">
        {/* Selector de reportes */}
        <ReportSelector
          reportOptions={reportOptions}
          selectedReportType={selectedReportType}
          onReportTypeChange={setSelectedReportType}
          fromDate={fromDate}
          onFromDateChange={setFromDate}
          toDate={toDate}
          onToDateChange={setToDate}
          onGenerateReport={handleGenerateReport}
          isLoading={isLoading}
          pacientes={pacientes}
          selectedPacienteId={selectedPacienteId}
          onPacienteChange={setSelectedPacienteId}
          showDateFilters={showDateFilters}
          showPacienteFilter={showPacienteFilter}
        />

        {/* Mensaje de error */}
        {error && (
          <Alert color="failure" icon={HiExclamation} className="mb-6">
            <span className="font-medium">Error:</span> {error}
          </Alert>
        )}
        
        {/* Visualizador de reportes */}
        <ReportViewer reportData={reportData} />
      </div>

      {/* Footer */}
      <footer className="text-center mt-12 py-6 border-t border-gray-300 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} DentiFIA - Sistema de Gestión Dental. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default ReportesHome;
