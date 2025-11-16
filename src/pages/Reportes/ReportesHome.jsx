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
  try {
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('es-SV', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.warn('Error formateando fecha:', fecha, error);
    return 'N/A';
  }
};

// Función para formatear moneda
const formatMoneda = (monto) => {
  if (monto === null || monto === undefined) return '$0.00';
  try {
    const numValue = parseFloat(monto);
    if (isNaN(numValue)) return '$0.00';
    return new Intl.NumberFormat('es-SV', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  } catch (error) {
    console.warn('Error formateando moneda:', monto, error);
    return '$0.00';
  }
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
  
  // Límite máximo de recuperaciones (por defecto 20, excepto historial clínico)
  const [limiteMaximo, setLimiteMaximo] = useState(20);

  // Determinar qué filtros mostrar según el tipo de reporte
  const showDateFilters = selectedReportType && selectedReportType !== ReportType.STOCK_INSUMOS;
  const showPacienteFilter = selectedReportType === ReportType.HISTORIAL_CLINICO || selectedReportType === ReportType.CITAS;
  const showLimiteMaximo = selectedReportType && selectedReportType !== ReportType.HISTORIAL_CLINICO;

  // Función para generar reporte
  const handleGenerateReport = useCallback(async () => {
    if (!selectedReportType) return;
    
    // Validación específica para historial clínico
    if (selectedReportType === ReportType.HISTORIAL_CLINICO) {
      if (!selectedPacienteId || selectedPacienteId === '') {
        setError('Por favor, seleccione un paciente para generar el reporte de historial clínico.');
        setReportData(null);
        return;
      }
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      const effectiveFromDate = showDateFilters ? fromDate : '1970-01-01';
      const effectiveToDate = showDateFilters ? toDate : new Date().toISOString().split('T')[0];

      // Preparar filtros según el tipo de reporte
      let filters = {};
      
      // Agregar límite máximo a todos los reportes excepto historial clínico
      if (selectedReportType !== ReportType.HISTORIAL_CLINICO) {
        filters.limiteMaximo = limiteMaximo;
      }
      
      if (selectedReportType === ReportType.PACIENTES) {
        filters = {
          ...filters,
          rangoEdad: filterRangoEdad,
          busquedaNombre: filterBusquedaNombre
        };
      } else if (selectedReportType === ReportType.FACTURACION) {
        filters = {
          ...filters,
          estadoFactura: filterEstadoFactura,
          metodoPago: filterMetodoPago,
          montoMinimo: filterMontoMinimo,
          montoMaximo: filterMontoMaximo,
          pacienteId: filterPacienteFactura
        };
      } else if (selectedReportType === ReportType.STOCK_INSUMOS) {
        filters = {
          ...filters,
          stockBajo: filterStockBajo,
          busquedaInsumo: filterBusquedaInsumo
        };
      } else if (selectedReportType === ReportType.MOVIMIENTOS_INVENTARIO) {
        filters = {
          ...filters,
          tipoMovimiento: filterTipoMovimiento,
          estadoMovimiento: filterEstadoMovimiento,
          usuarioMovimiento: filterUsuarioMovimiento,
          busquedaInsumo: filterBusquedaInsumoMov
        };
      } else if (selectedReportType === ReportType.CITAS) {
        // Solo usar filterPacienteCitas para citas, no usar selectedPacienteId como fallback
        filters = {
          ...filters,
          pacienteId: filterPacienteCitas && filterPacienteCitas !== '' ? filterPacienteCitas : null,
          estado: filterEstadoCitas
        };
      } else if (selectedReportType === ReportType.ENCUESTAS_SATISFACCION) {
        // Encuestas solo tiene limiteMaximo
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
      // Mensajes de error más específicos según el tipo de reporte
      let errorMessage = "Ocurrió un error al generar el reporte. Intente nuevamente.";
      if (selectedReportType === ReportType.HISTORIAL_CLINICO) {
        if (err.message && err.message.toLowerCase().includes('paciente')) {
          errorMessage = "No se pudo obtener el historial clínico. Verifique que el paciente seleccionado sea válido.";
        } else {
          errorMessage = "No se pudo generar el reporte de historial clínico. Verifique que el paciente tenga fichas clínicas en el período seleccionado.";
        }
      } else {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
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
    filterPacienteCitas, filterEstadoCitas,
    // Límite máximo
    limiteMaximo
  ]);

  // Limpiar selecciones de pacientes cuando cambia el tipo de reporte
  useEffect(() => {
    // Limpiar todos los estados de selección de pacientes al cambiar el tipo de reporte
    setSelectedPacienteId('');
    setFilterPacienteCitas('');
    setBusquedaPacienteHistorial('');
    setReportData(null);
    setError(null);
    // Resetear la lista filtrada de pacientes para historial clínico
    if (pacientes.length > 0) {
      setPacientesFiltradosHistorial(pacientes);
    }
  }, [selectedReportType]); // Solo ejecutar cuando cambia el tipo de reporte

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
    if (!reportData) {
      console.error('No hay datos del reporte para descargar');
      return;
    }
    
    // Importar dinámicamente las librerías de PDF
    import('jspdf').then(({ default: jsPDF }) => {
      import('jspdf-autotable').then(({ default: autoTable }) => {
        try {
          const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        // Colores del tema
        const primaryColor = [59, 130, 246]; // Azul
        const secondaryColor = [229, 231, 235]; // Gris claro
        const textColor = [31, 41, 55]; // Gris oscuro
        
        // Función para agregar encabezado
        const addHeader = () => {
          // Fondo del encabezado
          doc.setFillColor(...primaryColor);
          doc.rect(0, 0, pageWidth, 40, 'F');
          
          // Título del reporte
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(18);
          doc.setFont('helvetica', 'bold');
          doc.text(reportData.nombreReporte, 14, 20);
          
          // Información del reporte (en blanco sobre fondo azul)
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.text(`ID: ${reportData.id}`, pageWidth - 14, 15, { align: 'right' });
          doc.text(`Generado: ${new Date(reportData.fecha_generacion).toLocaleString('es-SV')}`, pageWidth - 14, 22, { align: 'right' });
          doc.text(`Período: ${formatFecha(reportData.desde)} - ${formatFecha(reportData.hasta)}`, pageWidth - 14, 29, { align: 'right' });
          
          // Resetear color de texto
          doc.setTextColor(...textColor);
        };
        
        // Función para agregar pie de página
        const addFooter = (pageNumber, totalPages) => {
          const footerY = pageHeight - 10;
          doc.setFontSize(8);
          doc.setTextColor(128, 128, 128);
          doc.setFont('helvetica', 'normal');
          doc.text(
            `Página ${pageNumber} de ${totalPages} | DentiFIA - Sistema de Gestión Dental`,
            pageWidth / 2,
            footerY,
            { align: 'center' }
          );
        };
        
        // Agregar encabezado
        addHeader();
        
        // Validar que haya datos
        if (!reportData.rows || reportData.rows.length === 0) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(128, 128, 128);
          doc.text('No hay datos para mostrar en este reporte.', 14, 60);
          doc.save(`${reportData.nombreReporte.replace(/\s+/g, '_')}_${reportData.id}.pdf`);
          return;
        }
        
        let startY = 50;
        let columns = Object.keys(reportData.rows[0] || {});
        let columnHeaders = [];
        let tableData = [];
        
        // Manejo especial para Historial Clínico
        if (reportData.nombreReporte === ReportType.HISTORIAL_CLINICO) {
          startY = 50;
          
          // Información del paciente
          if (reportData.datos_consolidados?.paciente) {
            const paciente = reportData.datos_consolidados.paciente;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...textColor);
            doc.text('Información del Paciente', 14, startY);
            
            startY += 8;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            
            const pacienteInfo = [
              `Nombre: ${paciente.nombre_completo || 'N/A'}`,
              paciente.dui ? `DUI: ${paciente.dui}` : '',
              paciente.fecha_nacimiento ? `Fecha de Nacimiento: ${formatFecha(paciente.fecha_nacimiento)}` : '',
              paciente.sexo ? `Sexo: ${paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}` : '',
              paciente.telefono ? `Teléfono: ${paciente.telefono}` : '',
              paciente.email ? `Email: ${paciente.email}` : ''
            ].filter(Boolean);
            
            pacienteInfo.forEach((info, idx) => {
              doc.text(info, 14, startY + (idx * 6));
            });
            
            startY += pacienteInfo.length * 6 + 10;
          }
          
          // Preparar datos de fichas clínicas - Formato de tarjetas en lugar de tabla
          if (reportData.rows && reportData.rows.length > 0) {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(`Fichas Clínicas (${reportData.rows.length})`, 14, startY);
            startY += 10;
            
            // Renderizar cada ficha clínica como una sección separada
            reportData.rows.forEach((ficha, index) => {
              // Verificar si necesitamos una nueva página
              if (startY > pageHeight - 80) {
                doc.addPage();
                addHeader();
                startY = 50;
              }
              
              // Título de la ficha
              doc.setFontSize(11);
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(...primaryColor);
              doc.text(`Ficha Clínica #${index + 1}`, 14, startY);
              
              startY += 8;
              
              // Línea separadora
              doc.setDrawColor(200, 200, 200);
              doc.line(14, startY, pageWidth - 14, startY);
              startY += 6;
              
              // Campos de la ficha con formato de lista
              doc.setFontSize(9);
              doc.setFont('helvetica', 'normal');
              doc.setTextColor(...textColor);
              
              const fieldLabels = {
                'numero_expediente': 'Expediente',
                'fechaCreacion': 'Fecha de Creación',
                'motivo_consulta': 'Motivo de Consulta',
                'diagnostico': 'Diagnóstico',
                'plan_tratamiento': 'Plan de Tratamiento',
                'estado_tratamiento': 'Estado del Tratamiento',
                'oclusion': 'Oclusión',
                'mordida': 'Mordida'
              };
              
              // Orden de campos preferido
              const fieldOrder = [
                'numero_expediente',
                'fechaCreacion',
                'motivo_consulta',
                'diagnostico',
                'oclusion',
                'mordida',
                'plan_tratamiento',
                'estado_tratamiento'
              ];
              
              fieldOrder.forEach(field => {
                if (ficha[field] && ficha[field] !== 'N/A' && ficha[field] !== null && ficha[field] !== undefined) {
                  const label = fieldLabels[field] || formatFieldName(field);
                  let value = String(ficha[field]);
                  
                  // Formatear fecha
                  if (field === 'fechaCreacion') {
                    value = formatFecha(ficha[field]);
                  }
                  
                  // Formatear estado
                  if (field === 'estado_tratamiento' && value) {
                    value = value.charAt(0).toUpperCase() + value.slice(1);
                  }
                  
                  // Mostrar etiqueta en negrita
                  doc.setFont('helvetica', 'bold');
                  const labelText = `${label}:`;
                  doc.text(labelText, 14, startY);
                  
                  // Calcular ancho disponible para el valor
                  const labelWidth = doc.getTextWidth(labelText);
                  const valueStartX = 14 + labelWidth + 5;
                  const maxWidth = pageWidth - valueStartX - 14;
                  
                  // Dividir texto largo en múltiples líneas
                  doc.setFont('helvetica', 'normal');
                  const lines = doc.splitTextToSize(value, maxWidth);
                  
                  if (lines.length > 0) {
                    // Primera línea al lado de la etiqueta
                    doc.text(lines[0], valueStartX, startY);
                    startY += 5;
                    
                    // Líneas adicionales con indentación
                    for (let i = 1; i < lines.length; i++) {
                      if (startY > pageHeight - 30) {
                        doc.addPage();
                        addHeader();
                        startY = 50;
                      }
                      doc.text(lines[i], valueStartX, startY);
                      startY += 5;
                    }
                  }
                  
                  startY += 4; // Espacio entre campos
                }
              });
              
              // Espacio entre fichas
              startY += 8;
            });
            
            // Para historial clínico, no usamos tabla, así que marcamos como completado
            columns = [];
            columnHeaders = [];
            tableData = [];
          } else {
            // Si no hay fichas, mostrar mensaje
            doc.setFontSize(10);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(128, 128, 128);
            doc.text('No se encontraron fichas clínicas para este paciente en el período seleccionado.', 14, startY);
            doc.save(`${reportData.nombreReporte.replace(/\s+/g, '_')}_${reportData.id}.pdf`);
            return;
          }
        } else if (reportData.nombreReporte === ReportType.FACTURACION) {
          // Estadísticas de facturación
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...textColor);
          
          const statsY = startY;
          if (reportData.total_facturas_periodo !== undefined) {
            doc.text(`Total Facturas: ${reportData.total_facturas_periodo}`, 14, statsY);
          }
          if (reportData.total_recaudado_periodo !== undefined) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(34, 197, 94); // Verde
            doc.text(`Total Recaudado: ${formatMoneda(reportData.total_recaudado_periodo)}`, 14, statsY + 6);
          }
          if (reportData.total_pendiente_periodo !== undefined) {
            doc.setTextColor(234, 179, 8); // Amarillo
            doc.text(`Total Pendiente: ${formatMoneda(reportData.total_pendiente_periodo)}`, 14, statsY + 12);
          }
          
          doc.setTextColor(...textColor);
          startY = statsY + 20;
          
          // Filtrar facturaId y precioTotal (Total Item) para evitar duplicación
          columns = columns.filter(col => col !== 'facturaId' && col !== 'precioTotal');
          
          // Definir orden de columnas para facturación (Total Factura al final)
          const facturacionColumnOrder = [
            'facturaCorrelativo',
            'facturaFecha',
            'pacienteNombre',
            'facturaEstado',
            'descripcion',
            'cantidad',
            'precioUnitario',
            'facturaPrecioTotal' // Total Factura al final
          ];
          
          // Reordenar columnas según el orden definido
          columns = facturacionColumnOrder.filter(col => columns.includes(col));
          
          // Columnas para facturación
          columnHeaders = columns.map(col => {
            const headerMap = {
              'facturaCorrelativo': 'N° Factura',
              'facturaFecha': 'Fecha',
              'pacienteNombre': 'Paciente',
              'facturaEstado': 'Estado',
              'descripcion': 'Descripción',
              'cantidad': 'Cant.',
              'precioUnitario': 'Precio Unit.',
              'facturaPrecioTotal': 'Total Factura'
            };
            return headerMap[col] || formatFieldName(col);
          });
          
          tableData = reportData.rows.map(row => 
            columns.map(col => {
              try {
                const value = row[col];
                
                if (col === 'facturaFecha') {
                  return value ? formatFecha(value) : 'N/A';
                }
                
                if (col === 'precioUnitario' || col === 'facturaPrecioTotal') {
                  const numValue = parseFloat(value);
                  return !isNaN(numValue) ? formatMoneda(numValue) : formatMoneda(0);
                }
                
                if (col === 'facturaEstado') {
                  return ESTADO_FACTURA_LABELS[value] || value || 'N/A';
                }
                
                return value !== null && value !== undefined ? String(value) : '';
              } catch (error) {
                console.warn(`Error procesando columna ${col}:`, error);
                return 'N/A';
              }
            })
          );
        } else if (reportData.nombreReporte === ReportType.CITAS) {
          columns = columns.filter(key => key !== 'created_at' && key !== 'updated_at');
          
          columnHeaders = columns.map(col => {
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
              
              if (col === 'fecha_hora') {
                return value ? formatFechaHora(value) : 'N/A';
              }
              
              if (col === 'estado') {
                return ESTADO_LABELS[value] || value || 'N/A';
              }
              
              return value || '';
            })
          );
        } else if (reportData.nombreReporte === ReportType.PACIENTES) {
          columnHeaders = columns.map(col => formatFieldName(col));
          
          tableData = reportData.rows.map(row => 
            columns.map(col => {
              const value = row[col];
              
              if (col === 'fecha_nacimiento' || col === 'fecha_registro') {
                return value ? formatFecha(value) : '-';
              }
              
              if (col === 'total_facturado') {
                return value ? formatMoneda(value) : formatMoneda(0);
              }
              
              return value || '-';
            })
          );
        } else if (reportData.nombreReporte === ReportType.ENCUESTAS_SATISFACCION) {
          columns = columns.filter(col => col !== 'preguntas_respuestas');
          
          if (reportData.total_encuestas !== undefined) {
            doc.setFontSize(10);
            doc.text(`Total Encuestas: ${reportData.total_encuestas || 0}`, 14, startY);
            doc.text(`Promedio Puntuación: ${reportData.promedio_puntuacion || '0.00'}/5`, 14, startY + 6);
            startY += 15;
          }
          
          columnHeaders = columns.map(col => {
            const headerMap = {
              'id': 'ID',
              'fecha': 'Fecha',
              'observaciones': 'Observaciones',
              'nivel_satisfaccion': 'Nivel Satisfacción'
            };
            return headerMap[col] || formatFieldName(col);
          });
          
          tableData = reportData.rows.map(row => 
            columns.map(col => {
              const value = row[col];
              
              if (col === 'fecha') {
                return value ? formatFecha(value) : 'N/A';
              }
              
              if (col === 'observaciones' && value) {
                return value.trim().replace(/\s+/g, ' ');
              }
              
              return value || 'N/A';
            })
          );
        } else {
          columnHeaders = columns.map(col => formatFieldName(col));
          tableData = reportData.rows.map(row => 
            columns.map(col => row[col] || '')
          );
        }
        
        // Preparar estilos de columnas según el tipo de reporte
        let columnStyles = {};
        if (reportData.nombreReporte === ReportType.FACTURACION) {
          columnStyles = {
            precioUnitario: { halign: 'right', cellWidth: 30 },
            facturaPrecioTotal: { halign: 'right', cellWidth: 35 },
            cantidad: { halign: 'center', cellWidth: 20 },
            descripcion: { cellWidth: 50 }
          };
        } else if (reportData.nombreReporte === ReportType.PACIENTES) {
          columnStyles = {
            total_citas: { halign: 'center' },
            total_citas_atendidas: { halign: 'center' },
            total_facturas: { halign: 'center' },
            total_facturado: { halign: 'right' },
            total_expedientes: { halign: 'center' }
          };
        } else if (reportData.nombreReporte === ReportType.ENCUESTAS_SATISFACCION) {
          columnStyles = {
            0: { cellWidth: 20, halign: 'center' },
            1: { cellWidth: 40, halign: 'center' },
            2: { cellWidth: 80, overflow: 'linebreak' },
            3: { cellWidth: 50, halign: 'center' }
          };
        }
        
        // Para historial clínico, ya se renderizó el contenido, solo agregar pie de página y guardar
        if (reportData.nombreReporte === ReportType.HISTORIAL_CLINICO) {
          // Agregar pie de página en todas las páginas
          const totalPages = doc.internal.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            addFooter(i, totalPages);
          }
          
          // Guardar PDF
          const fileName = `${reportData.nombreReporte.replace(/\s+/g, '_')}_${reportData.id}.pdf`;
          doc.save(fileName);
          return;
        }
        
        // Generar tabla con mejor diseño (solo para otros tipos de reporte)
        const finalY = autoTable(doc, {
          head: [columnHeaders],
          body: tableData,
          startY: startY,
          margin: { left: 14, right: 14 },
          styles: { 
            fontSize: reportData.nombreReporte === ReportType.ENCUESTAS_SATISFACCION ? 7 : 8,
            cellPadding: reportData.nombreReporte === ReportType.ENCUESTAS_SATISFACCION ? 2 : 3,
            overflow: reportData.nombreReporte === ReportType.ENCUESTAS_SATISFACCION ? 'linebreak' : 'ellipsize',
            cellWidth: reportData.nombreReporte === ReportType.ENCUESTAS_SATISFACCION ? 'wrap' : 'auto',
            textColor: textColor,
            lineColor: [200, 200, 200],
            lineWidth: 0.1
          },
          headStyles: { 
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9
          },
          alternateRowStyles: {
            fillColor: [249, 250, 251]
          },
          columnStyles: columnStyles,
          didDrawPage: (data) => {
            // Agregar encabezado en cada página
            addHeader();
            // Agregar pie de página
            const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
            const totalPages = doc.internal.getNumberOfPages();
            addFooter(pageNumber, totalPages);
          }
        });
        
        // Agregar resumen final para facturación
        if (reportData.nombreReporte === ReportType.FACTURACION && finalY && finalY.finalY) {
          const summaryY = finalY.finalY + 10;
          
          // Línea separadora
          doc.setDrawColor(200, 200, 200);
          doc.line(14, summaryY, pageWidth - 14, summaryY);
          
          // Resumen
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...textColor);
          doc.text('RESUMEN', 14, summaryY + 8);
          
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          
          let currentY = summaryY + 15;
          if (reportData.total_facturas_periodo !== undefined) {
            doc.text(`Total de Facturas: ${reportData.total_facturas_periodo}`, pageWidth - 14, currentY, { align: 'right' });
            currentY += 6;
          }
          if (reportData.total_recaudado_periodo !== undefined) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(34, 197, 94);
            doc.text(`Total Recaudado: ${formatMoneda(reportData.total_recaudado_periodo)}`, pageWidth - 14, currentY, { align: 'right' });
            currentY += 6;
          }
          if (reportData.total_pendiente_periodo !== undefined) {
            doc.setTextColor(234, 179, 8);
            doc.text(`Total Pendiente: ${formatMoneda(reportData.total_pendiente_periodo)}`, pageWidth - 14, currentY, { align: 'right' });
          }
        }
        
        // Agregar pie de página en la última página
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          addFooter(i, totalPages);
        }
        
        // Descargar
        const fileName = `${reportData.nombreReporte.replace(/\s+/g, '_')}_${reportData.id}.pdf`;
        doc.save(fileName);
        } catch (error) {
          console.error('Error generando PDF:', error);
          alert(`Error al generar el PDF: ${error.message || 'Error desconocido'}`);
        }
      }).catch((error) => {
        console.error('Error cargando jspdf-autotable:', error);
        alert('Error al cargar la librería de PDF. Por favor, recarga la página.');
      });
    }).catch((error) => {
      console.error('Error cargando jspdf:', error);
      alert('Error al cargar la librería de PDF. Por favor, recarga la página.');
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
              disabled={
                !selectedReportType || 
                isLoading || 
                (selectedReportType === ReportType.HISTORIAL_CLINICO && (!selectedPacienteId || selectedPacienteId === ''))
              }
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
                      {selectedReportType === ReportType.HISTORIAL_CLINICO && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <Select
                      value={selectedReportType === ReportType.CITAS ? filterPacienteCitas : selectedPacienteId}
                      onChange={(e) => {
                        if (selectedReportType === ReportType.CITAS) {
                          setFilterPacienteCitas(e.target.value);
                        } else {
                          setSelectedPacienteId(e.target.value);
                          // Limpiar error cuando se selecciona un paciente
                          if (e.target.value && error && error.includes('seleccione un paciente')) {
                            setError(null);
                          }
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
                    {selectedReportType === ReportType.HISTORIAL_CLINICO && (!selectedPacienteId || selectedPacienteId === '') && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Debe seleccionar un paciente para generar el reporte
                      </p>
                    )}
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

              {/* Campo de límite máximo de recuperaciones (para todos los reportes excepto historial clínico) */}
              {showLimiteMaximo && (
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                    Límite máximo de resultados
                  </label>
                  <TextInput
                    type="number"
                    min="1"
                    max="1000"
                    value={limiteMaximo}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        setLimiteMaximo(value);
                      } else if (e.target.value === '') {
                        setLimiteMaximo(20);
                      }
                    }}
                    placeholder="20"
                    helperText="Cantidad máxima de registros a mostrar (por defecto: 20)"
                  />
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
                          // Ocultar facturaId y precioTotal en reporte de facturación
                          if (reportData.nombreReporte === ReportType.FACTURACION) {
                            return key !== 'facturaId' && key !== 'precioTotal';
                          }
                          return true;
                        })
                        .sort((a, b) => {
                          // Ordenar columnas para facturación
                          if (reportData.nombreReporte === ReportType.FACTURACION) {
                            const order = [
                              'facturaCorrelativo',
                              'facturaFecha',
                              'pacienteNombre',
                              'facturaEstado',
                              'descripcion',
                              'cantidad',
                              'precioUnitario',
                              'facturaPrecioTotal' // Total Factura al final
                            ];
                            const indexA = order.indexOf(a);
                            const indexB = order.indexOf(b);
                            if (indexA === -1 && indexB === -1) return 0;
                            if (indexA === -1) return 1;
                            if (indexB === -1) return -1;
                            return indexA - indexB;
                          }
                          return 0;
                        })
                        .map((key, index) => {
                          // Mejorar nombres de columnas para facturación
                          let headerName = formatFieldName(key);
                          if (reportData.nombreReporte === ReportType.FACTURACION) {
                            const headerMap = {
                              'facturaCorrelativo': 'N° Factura',
                              'facturaFecha': 'Fecha',
                              'pacienteNombre': 'Paciente',
                              'facturaEstado': 'Estado',
                              'descripcion': 'Descripción',
                              'cantidad': 'Cant.',
                              'precioUnitario': 'Precio Unit.',
                              'facturaPrecioTotal': 'Total Factura'
                            };
                            headerName = headerMap[key] || headerName;
                          }
                          return (
                            <TableHeadCell 
                              key={index}
                              className={
                                reportData.nombreReporte === ReportType.FACTURACION && 
                                (key === 'precioUnitario' || key === 'facturaPrecioTotal')
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
                        // Ocultar facturaId y precioTotal en reporte de facturación
                        if (reportData.nombreReporte === ReportType.FACTURACION) {
                          return key !== 'facturaId' && key !== 'precioTotal';
                        }
                        return true;
                      }).sort((a, b) => {
                        // Ordenar columnas para facturación
                        if (reportData.nombreReporte === ReportType.FACTURACION) {
                          const order = [
                            'facturaCorrelativo',
                            'facturaFecha',
                            'pacienteNombre',
                            'facturaEstado',
                            'descripcion',
                            'cantidad',
                            'precioUnitario',
                            'facturaPrecioTotal' // Total Factura al final
                          ];
                          const indexA = order.indexOf(a);
                          const indexB = order.indexOf(b);
                          if (indexA === -1 && indexB === -1) return 0;
                          if (indexA === -1) return 1;
                          if (indexB === -1) return -1;
                          return indexA - indexB;
                        }
                        return 0;
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
                                (key === 'precioUnitario' || key === 'facturaPrecioTotal')) {
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