import React, { useState, useCallback, useEffect } from 'react';
import { Button, TextInput, Select, Alert, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Badge, Spinner, Card } from 'flowbite-react';
import { HiSearch, HiDownload, HiDocumentReport, HiExclamation, HiCalendar } from 'react-icons/hi';
import Navegacion from '../Common/Navegacion';
import { generateReport, getPacientes } from '../../services/reportService';
import { ReportType } from '../../types/reportTypes';
import { useAuth } from '../../auth/useAuth';

// Función para convertir snake_case o camelCase a formato legible
const formatFieldName = (fieldName) => {
  // Reemplazar snake_case con espacios
  let formatted = fieldName.replace(/_/g, ' ');
  // Reemplazar camelCase con espacios antes de mayúsculas
  formatted = formatted.replace(/([a-z])([A-Z])/g, '$1 $2');
  // Capitalizar primera letra de cada palabra
  formatted = formatted.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
  return formatted;
};

// Función para formatear fecha y hora (igual que en TableCitas)
const formatFechaHora = (fechaHora) => {
  if (!fechaHora) return 'N/A';
  const date = new Date(fechaHora);
  return date.toLocaleString('es-SV', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Constantes de estado para citas (igual que en TableCitas)
const ESTADO_COLORS = {
  'programada': 'blue',
  'atendida': 'green',
  'cancelada': 'red',
  'reprogramada': 'yellow',
  'no_asistio': 'gray'
};

const ESTADO_LABELS = {
  'programada': 'Programada',
  'atendida': 'Atendida',
  'cancelada': 'Cancelada',
  'reprogramada': 'Reprogramada',
  'no_asistio': 'No Asistió'
};

// Constantes de estado para facturas
const ESTADO_FACTURA_COLORS = {
  'Pagada': 'green',
  'Pendiente': 'yellow',
  'Cancelada': 'red',
  'Aceptada': 'blue'
};

const ESTADO_FACTURA_LABELS = {
  'Pagada': 'Pagada',
  'Pendiente': 'Pendiente',
  'Cancelada': 'Cancelada',
  'Aceptada': 'Aceptada'
};

// Función para formatear fecha (solo fecha, sin hora)
const formatFecha = (fecha) => {
  if (!fecha) return 'N/A';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-SV', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Función para formatear moneda
const formatMoneda = (monto) => {
  if (monto === null || monto === undefined || isNaN(monto)) return '$0.00';
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(monto);
};

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
  const [filterPacienteCitas, setFilterPacienteCitas] = useState('');
  const [filterEstadoCitas, setFilterEstadoCitas] = useState('');
  const [busquedaPacienteHistorial, setBusquedaPacienteHistorial] = useState('');
  const [pacientesFiltradosHistorial, setPacientesFiltradosHistorial] = useState([]);
  
  // Filtros específicos por reporte
  // Pacientes
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
  const showPacienteFilter = selectedReportType === ReportType.HISTORIAL_CLINICO || selectedReportType === ReportType.CITAS;

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
      } else if (selectedReportType === ReportType.CITAS) {
        const pacienteIdValue = filterPacienteCitas || selectedPacienteId;
        filters = {
          pacienteId: pacienteIdValue && pacienteIdValue !== '' ? pacienteIdValue : null,
          estado: filterEstadoCitas
        };
      } else if (selectedReportType === ReportType.HISTORIAL_CLINICO) {
        filters = {
          pacienteId: selectedPacienteId
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
    filterRangoEdad, filterBusquedaNombre,
    // Filtros de facturación
    filterEstadoFactura, filterMetodoPago, filterMontoMinimo, filterMontoMaximo, filterPacienteFactura,
    // Filtros de stock
    filterStockBajo, filterBusquedaInsumo,
    // Filtros de movimientos
    filterTipoMovimiento, filterEstadoMovimiento, filterUsuarioMovimiento, filterBusquedaInsumoMov,
    // Filtros de citas
    filterPacienteCitas, filterEstadoCitas
  ]);

  // Cargar pacientes al montar el componente
  useEffect(() => {
    const loadPacientes = async () => {
      try {
        const accessToken = auth.getAccessToken();
        const pacientesData = await getPacientes(accessToken);
        setPacientes(pacientesData);
        setPacientesFiltradosHistorial(pacientesData);
      } catch (error) {
        console.error('Error cargando pacientes:', error);
      }
    };
    loadPacientes();
  }, [auth]);

  // Filtrar pacientes por nombre + DUI para historial clínico
  useEffect(() => {
    if (selectedReportType === ReportType.HISTORIAL_CLINICO && busquedaPacienteHistorial) {
      const busqueda = busquedaPacienteHistorial.toLowerCase().trim();
      const filtrados = pacientes.filter(p => {
        const nombreCompleto = `${p.nombre || ''} ${p.dui || ''}`.toLowerCase();
        return nombreCompleto.includes(busqueda) || 
               (p.dui && p.dui.toLowerCase().includes(busqueda)) ||
               (p.nombre && p.nombre.toLowerCase().includes(busqueda));
      });
      setPacientesFiltradosHistorial(filtrados);
    } else {
      setPacientesFiltradosHistorial(pacientes);
    }
  }, [busquedaPacienteHistorial, pacientes, selectedReportType]);

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
        
        // Preparar datos para la tabla según el tipo de reporte
        let columns = Object.keys(reportData.rows[0] || {});
        let columnHeaders = [];
        let tableData = [];
        
        if (reportData.nombreReporte === ReportType.CITAS) {
          // Para reporte de citas: ocultar created_at y updated_at, formatear fechas y estados
          columns = columns.filter(key => key !== 'created_at' && key !== 'updated_at');
          
          columnHeaders = columns.map(col => {
            // Mejorar nombres de columnas
            const headerMap = {
              'id': 'ID',
              'nombre_completo': 'Nombre Completo',
              'fecha_hora': 'Fecha Hora',
              'motivo': 'Motivo',
              'doctor_nombre': 'Doctor Nombre',
              'estado': 'Estado'
            };
            return headerMap[col] || formatFieldName(col);
          });
          
          tableData = reportData.rows.map(row => 
            columns.map(col => {
              const value = row[col];
              
              // Formatear fecha_hora
              if (col === 'fecha_hora') {
                return value ? formatFechaHora(value) : 'N/A';
              }
              
              // Formatear estado con label
              if (col === 'estado') {
                return ESTADO_LABELS[value] || value || 'N/A';
              }
              
              return value || '';
            })
          );
        } else if (reportData.nombreReporte === ReportType.FACTURACION) {
          // Para reporte de facturación: formatear fechas, montos y estados
          columnHeaders = columns.map(col => {
            const headerMap = {
              'facturaId': 'ID Factura',
              'facturaCorrelativo': 'N° Factura',
              'facturaFecha': 'Fecha',
              'facturaPrecioTotal': 'Total Factura',
              'pacienteNombre': 'Paciente',
              'facturaEstado': 'Estado',
              'descripcion': 'Descripción',
              'cantidad': 'Cant.',
              'precioUnitario': 'Precio Unit.',
              'precioTotal': 'Total Item'
            };
            return headerMap[col] || formatFieldName(col);
          });
          
          tableData = reportData.rows.map(row => 
            columns.map(col => {
              const value = row[col];
              
              // Formatear fecha
              if (col === 'facturaFecha') {
                return value ? formatFecha(value) : 'N/A';
              }
              
              // Formatear montos
              if (col === 'precioUnitario' || col === 'precioTotal' || col === 'facturaPrecioTotal') {
                return value ? formatMoneda(value) : formatMoneda(0);
              }
              
              // Formatear estado
              if (col === 'facturaEstado') {
                return ESTADO_FACTURA_LABELS[value] || value || 'N/A';
              }
              
              return value || '';
            })
          );
        } else if (reportData.nombreReporte === ReportType.PACIENTES) {
          // Para reporte de pacientes: formatear fechas y montos
          columnHeaders = columns.map(col => formatFieldName(col));
          
          tableData = reportData.rows.map(row => 
            columns.map(col => {
              const value = row[col];
              
              // Formatear fechas
              if (col === 'fecha_nacimiento' || col === 'fecha_registro') {
                return value ? formatFecha(value) : '-';
              }
              
              // Formatear total facturado
              if (col === 'total_facturado') {
                return value ? formatMoneda(value) : formatMoneda(0);
              }
              
              return value || '-';
            })
          );
        } else {
          // Para otros reportes: formato genérico
          columnHeaders = columns.map(col => formatFieldName(col));
          tableData = reportData.rows.map(row => 
            columns.map(col => row[col] || '')
          );
        }
        
        // Generar tabla
        autoTable(doc, {
          head: [columnHeaders],
          body: tableData,
          startY: 50,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [59, 130, 246] },
          columnStyles: reportData.nombreReporte === ReportType.FACTURACION ? {
            // Alinear montos a la derecha en facturación
            precioUnitario: { halign: 'right' },
            precioTotal: { halign: 'right' },
            facturaPrecioTotal: { halign: 'right' },
            cantidad: { halign: 'center' }
          } : reportData.nombreReporte === ReportType.PACIENTES ? {
            // Alinear estadísticas numéricas en pacientes
            total_citas: { halign: 'center' },
            total_citas_atendidas: { halign: 'center' },
            total_facturas: { halign: 'center' },
            total_facturado: { halign: 'right' },
            total_expedientes: { halign: 'center' }
          } : {}
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
              <option value={ReportType.CITAS}>Reporte de Citas</option>
              <option value={ReportType.HISTORIAL_CLINICO}>Historial Clínico</option>
              <option value={ReportType.FACTURACION}>Reporte de Facturación</option>
              <option value={ReportType.ENCUESTAS_SATISFACCION}>Encuestas de Satisfacción</option>
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
              
              {/* Filtro de paciente para historial clínico y citas */}
              {showPacienteFilter && (
                <>
                  {selectedReportType === ReportType.HISTORIAL_CLINICO && (
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Buscar por nombre o DUI
                      </label>
                      <TextInput
                        placeholder="Nombre o DUI del paciente..."
                        value={busquedaPacienteHistorial}
                        onChange={(e) => setBusquedaPacienteHistorial(e.target.value)}
                        icon={HiSearch}
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                      {selectedReportType === ReportType.CITAS ? 'Filtrar por paciente (opcional)' : 'Paciente'}
                    </label>
                    <Select
                      value={selectedReportType === ReportType.CITAS ? filterPacienteCitas : selectedPacienteId}
                      onChange={(e) => {
                        if (selectedReportType === ReportType.CITAS) {
                          setFilterPacienteCitas(e.target.value);
                        } else {
                          setSelectedPacienteId(e.target.value);
                        }
                      }}
                    >
                      <option value="">{selectedReportType === ReportType.CITAS ? 'Todos los pacientes' : 'Seleccionar paciente'}</option>
                      {(selectedReportType === ReportType.HISTORIAL_CLINICO ? pacientesFiltradosHistorial : pacientes).map(paciente => (
                        <option key={paciente.id} value={paciente.id}>
                          {paciente.nombre} {paciente.dui ? `(${paciente.dui})` : ''}
                        </option>
                      ))}
                    </Select>
                  </div>
                  {selectedReportType === ReportType.CITAS && (
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Estado
                      </label>
                      <Select
                        value={filterEstadoCitas}
                        onChange={(e) => setFilterEstadoCitas(e.target.value)}
                      >
                        <option value="">Todos los estados</option>
                        <option value="programada">Programada</option>
                        <option value="atendida">Atendida</option>
                        <option value="cancelada">Cancelada</option>
                        <option value="reprogramada">Reprogramada</option>
                        <option value="no_asistio">No Asistió</option>
                      </Select>
                    </div>
                  )}
                </>
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
                {reportData.total_facturas_periodo !== undefined && (
                  <div>
                    <span className="font-medium dark:text-gray-300">Total Facturas:</span>
                    <p className="text-gray-600 dark:text-gray-400">{reportData.total_facturas_periodo}</p>
                  </div>
                )}
                {reportData.total_recaudado_periodo !== undefined && (
                  <div>
                    <span className="font-medium dark:text-gray-300">Total Recaudado:</span>
                    <p className="text-green-600 dark:text-green-400 font-semibold">{formatMoneda(reportData.total_recaudado_periodo)}</p>
                  </div>
                )}
                {reportData.total_pendiente_periodo !== undefined && (
                  <div>
                    <span className="font-medium dark:text-gray-300">Total Pendiente:</span>
                    <p className="text-yellow-600 dark:text-yellow-400 font-semibold">{formatMoneda(reportData.total_pendiente_periodo)}</p>
                  </div>
                )}
                {reportData.total_fichas && (
                  <div>
                    <span className="font-medium dark:text-gray-300">Total Fichas Clínicas:</span>
                    <p className="text-gray-600 dark:text-gray-400">{reportData.total_fichas}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Renderizado especial para Historial Clínico */}
            {reportData.nombreReporte === ReportType.HISTORIAL_CLINICO && reportData.datos_consolidados ? (
              <div className="p-6 space-y-6">
                {/* Información del Paciente */}
                {reportData.datos_consolidados.paciente && (
                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700">
                    <div className="mb-4">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Información del Paciente
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        <div>
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Nombre Completo:</span>
                          <p className="text-gray-900 dark:text-white font-medium">{reportData.datos_consolidados.paciente.nombre_completo}</p>
                        </div>
                        {reportData.datos_consolidados.paciente.dui && (
                          <div>
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">DUI:</span>
                            <p className="text-gray-900 dark:text-white font-medium">{reportData.datos_consolidados.paciente.dui}</p>
                          </div>
                        )}
                        {reportData.datos_consolidados.paciente.fecha_nacimiento && (
                          <div>
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Fecha de Nacimiento:</span>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {new Date(reportData.datos_consolidados.paciente.fecha_nacimiento).toLocaleDateString('es-ES', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        )}
                        {reportData.datos_consolidados.paciente.sexo && (
                          <div>
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Sexo:</span>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {reportData.datos_consolidados.paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}
                            </p>
                          </div>
                        )}
                        {reportData.datos_consolidados.paciente.telefono && (
                          <div>
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Teléfono:</span>
                            <p className="text-gray-900 dark:text-white font-medium">{reportData.datos_consolidados.paciente.telefono}</p>
                          </div>
                        )}
                        {reportData.datos_consolidados.paciente.celular && (
                          <div>
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Celular:</span>
                            <p className="text-gray-900 dark:text-white font-medium">{reportData.datos_consolidados.paciente.celular}</p>
                          </div>
                        )}
                        {reportData.datos_consolidados.paciente.email && (
                          <div>
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Email:</span>
                            <p className="text-gray-900 dark:text-white font-medium">{reportData.datos_consolidados.paciente.email}</p>
                          </div>
                        )}
                        {reportData.datos_consolidados.paciente.direccion && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Dirección:</span>
                            <p className="text-gray-900 dark:text-white font-medium">{reportData.datos_consolidados.paciente.direccion}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Antecedentes Médicos */}
                    {reportData.datos_consolidados.antecedentes && Object.keys(reportData.datos_consolidados.antecedentes).length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
                        <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Antecedentes Médicos</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(reportData.datos_consolidados.antecedentes).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <p className="text-gray-900 dark:text-white font-medium">
                                {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : (value || 'N/A')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Expedientes */}
                    {reportData.datos_consolidados.expedientes && reportData.datos_consolidados.expedientes.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
                        <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Expedientes</h5>
                        <div className="flex flex-wrap gap-2">
                          {reportData.datos_consolidados.expedientes.map((exp, idx) => (
                            <Badge key={idx} color="info" className="text-sm">
                              {exp.numero_expediente}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                )}

                {/* Fichas Clínicas */}
                {reportData.rows && reportData.rows.length > 0 && (
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Fichas Clínicas ({reportData.rows.length})
                    </h4>
                    <div className="space-y-4">
                      {reportData.rows.map((ficha, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                  Ficha Clínica #{ficha.id || index + 1}
                                </h5>
                                {ficha.numero_expediente && (
                                  <Badge color="info" className="mb-2">
                                    Expediente: {ficha.numero_expediente}
                                  </Badge>
                                )}
                              </div>
                              {ficha.estado_tratamiento && (
                                <Badge 
                                  color={ficha.estado_tratamiento === 'activo' ? 'success' : ficha.estado_tratamiento === 'finalizado' ? 'info' : 'warning'}
                                  className="text-sm"
                                >
                                  {ficha.estado_tratamiento.charAt(0).toUpperCase() + ficha.estado_tratamiento.slice(1)}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {ficha.fechaCreacion && (
                                <div>
                                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Fecha de Creación:</span>
                                  <p className="text-gray-900 dark:text-white">
                                    {new Date(ficha.fechaCreacion).toLocaleDateString('es-ES', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </p>
                                </div>
                              )}
                              {ficha.motivo_consulta && ficha.motivo_consulta !== 'N/A' && (
                                <div>
                                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Motivo de Consulta:</span>
                                  <p className="text-gray-900 dark:text-white">{ficha.motivo_consulta}</p>
                                </div>
                              )}
                              {ficha.diagnostico && ficha.diagnostico !== 'N/A' && (
                                <div>
                                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Diagnóstico:</span>
                                  <p className="text-gray-900 dark:text-white">{ficha.diagnostico}</p>
                                </div>
                              )}
                              {ficha.oclusion && ficha.oclusion !== 'N/A' && (
                                <div>
                                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Oclusión:</span>
                                  <p className="text-gray-900 dark:text-white">{ficha.oclusion}</p>
                                </div>
                              )}
                              {ficha.mordida && ficha.mordida !== 'N/A' && (
                                <div>
                                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Mordida:</span>
                                  <p className="text-gray-900 dark:text-white">{ficha.mordida}</p>
                                </div>
                              )}
                              {ficha.plan_tratamiento && ficha.plan_tratamiento !== 'N/A' && (
                                <div className="md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Plan de Tratamiento:</span>
                                  <p className="text-gray-900 dark:text-white">{ficha.plan_tratamiento}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {reportData.rows && reportData.rows.length === 0 && (
                  <Alert color="info" className="mt-4">
                    No se encontraron fichas clínicas para este paciente en el período seleccionado.
                  </Alert>
                )}
              </div>
            ) : (
              /* Tabla de datos para otros tipos de reporte */
              <div className="overflow-x-auto">
                <Table hoverable>
                  <TableHead>
                    <TableRow>
                      {reportData.rows.length > 0 && Object.keys(reportData.rows[0])
                        .filter(key => {
                          // Ocultar created_at y updated_at en reporte de citas
                          if (reportData.nombreReporte === ReportType.CITAS) {
                            return key !== 'created_at' && key !== 'updated_at';
                          }
                          return true;
                        })
                        .map((key, index) => {
                          // Mejorar nombres de columnas para facturación
                          let headerName = formatFieldName(key);
                          if (reportData.nombreReporte === ReportType.FACTURACION) {
                            const headerMap = {
                              'facturaId': 'ID Factura',
                              'facturaCorrelativo': 'N° Factura',
                              'facturaFecha': 'Fecha',
                              'facturaPrecioTotal': 'Total Factura',
                              'pacienteNombre': 'Paciente',
                              'facturaEstado': 'Estado',
                              'descripcion': 'Descripción',
                              'cantidad': 'Cant.',
                              'precioUnitario': 'Precio Unit.',
                              'precioTotal': 'Total Item'
                            };
                            headerName = headerMap[key] || headerName;
                          }
                          return (
                            <TableHeadCell 
                              key={index}
                              className={
                                reportData.nombreReporte === ReportType.FACTURACION && 
                                (key === 'precioUnitario' || key === 'precioTotal' || key === 'facturaPrecioTotal')
                                  ? 'text-right'
                                  : reportData.nombreReporte === ReportType.FACTURACION && key === 'cantidad'
                                  ? 'text-center'
                                  : ''
                              }
                            >
                              {headerName}
                            </TableHeadCell>
                          );
                        })}
                    </TableRow>
                  </TableHead>
                  <TableBody className="divide-y">
                    {reportData.rows.map((row, rowIndex) => {
                      const rowKeys = Object.keys(row).filter(key => {
                        // Ocultar created_at y updated_at en reporte de citas
                        if (reportData.nombreReporte === ReportType.CITAS) {
                          return key !== 'created_at' && key !== 'updated_at';
                        }
                        return true;
                      });
                      return (
                        <TableRow key={rowIndex} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                          {rowKeys.map((key, colIndex) => {
                            const value = row[key];
                            
                            // Formatear fecha_hora para reporte de citas
                            if (reportData.nombreReporte === ReportType.CITAS && key === 'fecha_hora') {
                              return (
                                <TableCell key={colIndex} className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                  {formatFechaHora(value)}
                                </TableCell>
                              );
                            }
                            
                            // Formatear estado con Badge para reporte de citas
                            if (reportData.nombreReporte === ReportType.CITAS && key === 'estado') {
                              return (
                                <TableCell key={colIndex}>
                                  <Badge color={ESTADO_COLORS[value] || 'gray'}>
                                    {ESTADO_LABELS[value] || value}
                                  </Badge>
                                </TableCell>
                              );
                            }
                            
                            // Formatear fecha para reporte de facturación
                            if (reportData.nombreReporte === ReportType.FACTURACION && key === 'facturaFecha') {
                              return (
                                <TableCell key={colIndex} className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                  {formatFecha(value)}
                                </TableCell>
                              );
                            }
                            
                            // Formatear montos para reporte de facturación
                            if (reportData.nombreReporte === ReportType.FACTURACION && 
                                (key === 'precioUnitario' || key === 'precioTotal' || key === 'facturaPrecioTotal')) {
                              return (
                                <TableCell key={colIndex} className="text-right font-medium text-gray-900 dark:text-white">
                                  {formatMoneda(value)}
                                </TableCell>
                              );
                            }
                            
                            // Formatear estado con Badge para reporte de facturación
                            if (reportData.nombreReporte === ReportType.FACTURACION && key === 'facturaEstado') {
                              return (
                                <TableCell key={colIndex}>
                                  <Badge color={ESTADO_FACTURA_COLORS[value] || 'gray'}>
                                    {ESTADO_FACTURA_LABELS[value] || value}
                                  </Badge>
                                </TableCell>
                              );
                            }
                            
                            // Formatear cantidad para reporte de facturación (centrado)
                            if (reportData.nombreReporte === ReportType.FACTURACION && key === 'cantidad') {
                              return (
                                <TableCell key={colIndex} className="text-center font-medium text-gray-900 dark:text-white">
                                  {value || 0}
                                </TableCell>
                              );
                            }
                            
                            // Renderizar preguntas_respuestas de forma especial
                            if (key === 'preguntas_respuestas' && value && value !== 'N/A' && typeof value === 'string') {
                              return (
                                <TableCell key={colIndex} className="max-w-md">
                                  <div className="text-sm text-left">
                                    {value.split('\n\n').map((item, idx) => (
                                      <div key={idx} className="mb-2 last:mb-0 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                        <pre className="whitespace-pre-wrap text-xs font-sans text-gray-700 dark:text-gray-300">
                                          {item}
                                        </pre>
                                      </div>
                                    ))}
                                  </div>
                                </TableCell>
                              );
                            }
                            // Renderizar observaciones con mejor formato si es largo
                            if (key === 'observaciones' && value && value.length > 50) {
                              return (
                                <TableCell key={colIndex} className="max-w-xs">
                                  <div className="text-sm text-gray-900 dark:text-white" title={value}>
                                    {value.substring(0, 50)}...
                                  </div>
                                </TableCell>
                              );
                            }
                            // Manejar objetos y arrays
                            if (typeof value === 'object' && value !== null) {
                              if (Array.isArray(value)) {
                                return (
                                  <TableCell key={colIndex} className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {value.length > 0 ? value.join(', ') : '-'}
                                  </TableCell>
                                );
                              }
                              // Si es un objeto, convertirlo a string JSON o mostrar un mensaje
                              return (
                                <TableCell key={colIndex} className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                  {value.toString ? value.toString() : JSON.stringify(value)}
                                </TableCell>
                              );
                            }
                            // Formatear fecha_nacimiento para reporte de pacientes
                            if (reportData.nombreReporte === ReportType.PACIENTES && key === 'fecha_nacimiento') {
                              return (
                                <TableCell key={colIndex} className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                  {value ? formatFecha(value) : '-'}
                                </TableCell>
                              );
                            }
                            
                            // Formatear fecha_registro para reporte de pacientes
                            if (reportData.nombreReporte === ReportType.PACIENTES && key === 'fecha_registro') {
                              return (
                                <TableCell key={colIndex} className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                  {value ? formatFecha(value) : '-'}
                                </TableCell>
                              );
                            }
                            
                            // Formatear estadísticas numéricas para reporte de pacientes
                            if (reportData.nombreReporte === ReportType.PACIENTES && 
                                (key === 'total_citas' || key === 'total_citas_atendidas' || 
                                 key === 'total_facturas' || key === 'total_expedientes')) {
                              return (
                                <TableCell key={colIndex} className="text-center font-medium text-gray-900 dark:text-white">
                                  {value || 0}
                                </TableCell>
                              );
                            }
                            
                            // Formatear total facturado para reporte de pacientes
                            if (reportData.nombreReporte === ReportType.PACIENTES && key === 'total_facturado') {
                              return (
                                <TableCell key={colIndex} className="text-right font-medium text-gray-900 dark:text-white">
                                  {value ? formatMoneda(value) : formatMoneda(0)}
                                </TableCell>
                              );
                            }
                            
                            
                            // Renderizado normal
                            return (
                              <TableCell key={colIndex} className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {value || '-'}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
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