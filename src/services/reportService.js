// Servicio de reportes para DentiFIA
// Integra datos reales del backend con datos mock para módulos faltantes

import { API_URL } from '../api/api';
import { ReportType, CitaEstado } from '../types/reportTypes';

// Datos mock para módulos faltantes
const mockServicios = [
  { id: 's-1', nombre: 'Consulta General', tipo: 'Consulta', duracionEstimadaMin: 30, costoBase: 50 },
  { id: 's-2', nombre: 'Limpieza Dental', tipo: 'Procedimiento', duracionEstimadaMin: 45, costoBase: 75 },
  { id: 's-3', nombre: 'Ortodoncia - Revisión', tipo: 'Ortodoncia', duracionEstimadaMin: 20, costoBase: 60 },
  { id: 's-4', nombre: 'Blanqueamiento Dental', tipo: 'Estética', duracionEstimadaMin: 90, costoBase: 200 },
  { id: 's-5', nombre: 'Extracción Simple', tipo: 'Cirugía', duracionEstimadaMin: 60, costoBase: 120 },
];

const mockCitas = [
  { id: 'c-1', pacienteId: 'p-1', servicioId: 's-1', fecha: '2024-07-01', hora: '09:00', estado: CitaEstado.ATENDIDO, notas: 'Control anual', doctorId: 'doc-1' },
  { id: 'c-2', pacienteId: 'p-2', servicioId: 's-2', fecha: '2024-07-01', hora: '10:00', estado: CitaEstado.ATENDIDO, doctorId: 'doc-1' },
  { id: 'c-3', pacienteId: 'p-3', servicioId: 's-3', fecha: '2024-07-02', hora: '11:00', estado: CitaEstado.CANCELADO, notas: 'Paciente llamó para cancelar', doctorId: 'doc-2' },
  { id: 'c-4', pacienteId: 'p-1', servicioId: 's-1', fecha: '2024-07-08', hora: '09:00', estado: CitaEstado.REPROGRAMADO, notas: 'Reprogramada para el 15/07', doctorId: 'doc-1' },
  { id: 'c-5', pacienteId: 'p-4', servicioId: 's-4', fecha: '2024-07-10', hora: '14:00', estado: CitaEstado.PROGRAMADA, doctorId: 'doc-2' },
  { id: 'c-6', pacienteId: 'p-2', servicioId: 's-5', fecha: '2023-12-15', hora: '15:00', estado: CitaEstado.ATENDIDO, notas: 'Extracción muela del juicio', doctorId: 'doc-1' },
  { id: 'c-7', pacienteId: 'p-3', servicioId: 's-1', fecha: '2024-06-20', hora: '08:30', estado: CitaEstado.NO_ASISTIO, doctorId: 'doc-2' },
];

const mockEncuestas = [
  { id: 'e-1', pacienteId: 'p-1', servicioId: 's-1', fecha: '2024-07-01', puntuacionGeneral: 5, comentarios: 'Excelente atención, muy profesional.' },
  { id: 'e-2', pacienteId: 'p-2', servicioId: 's-2', fecha: '2024-07-01', puntuacionGeneral: 4, comentarios: 'Todo bien, aunque la espera fue un poco larga.' },
  { id: 'e-3', pacienteId: 'p-1', servicioId: 's-1', fecha: '2023-11-05', puntuacionGeneral: 5, comentarios: 'Siempre satisfecho con el servicio.' },
  { id: 'e-4', pacienteId: 'p-4', servicioId: 's-4', fecha: '2024-07-10', puntuacionGeneral: 3, comentarios: 'El procedimiento fue doloroso pero el resultado es bueno.' },
];

// Función auxiliar para verificar si una fecha está en el rango
const isInDateRange = (itemDateStr, desdeStr, hastaStr) => {
  if (!itemDateStr || !desdeStr || !hastaStr) return false;
  
  const itemDate = new Date(itemDateStr);
  const startDate = new Date(desdeStr);
  const endDate = new Date(hastaStr);
  
  itemDate.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  
  return itemDate >= startDate && itemDate <= endDate;
};

// Función para formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Fecha Inválida';
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Función para formatear moneda
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-SV', { 
    style: 'currency', 
    currency: 'USD', 
    minimumFractionDigits: 2 
  }).format(amount);
};

// Función principal para generar reportes
export const generateReport = async (reportType, desde, hasta, pacienteId = null, accessToken = null) => {
  const reportId = `REP-${Date.now()}`;
  const fecha_generacion = new Date().toISOString();

  try {
    switch (reportType) {
      case ReportType.CITAS:
        return await generateCitasReport(reportId, fecha_generacion, desde, hasta);
      
      case ReportType.PACIENTES:
        return await generatePacientesReport(reportId, fecha_generacion, desde, hasta, accessToken);
      
      case ReportType.HISTORIAL_CLINICO:
        return await generateHistorialClinicoReport(reportId, fecha_generacion, desde, hasta, pacienteId, accessToken);
      
      case ReportType.FACTURACION:
        return await generateFacturacionReport(reportId, fecha_generacion, desde, hasta, accessToken);
      
      case ReportType.ENCUESTAS_SATISFACCION:
        return await generateEncuestasReport(reportId, fecha_generacion, desde, hasta);
      
      case ReportType.STOCK_INSUMOS:
        return await generateStockReport(reportId, fecha_generacion, desde, hasta, accessToken);
      
      case ReportType.MOVIMIENTOS_INVENTARIO:
        return await generateMovimientosReport(reportId, fecha_generacion, desde, hasta, accessToken);
      
      default:
        throw new Error(`Tipo de reporte no implementado: ${reportType}`);
    }
  } catch (error) {
    console.error('Error generando reporte:', error);
    throw error;
  }
};

// Reporte de Citas (Mock)
const generateCitasReport = async (reportId, fecha_generacion, desde, hasta) => {
  const citasFiltradas = mockCitas
    .filter(c => isInDateRange(c.fecha, desde, hasta))
    .map(c => {
      const servicio = mockServicios.find(s => s.id === c.servicioId);
      return {
        ...c,
        servicioNombre: servicio?.nombre || 'N/A',
        servicioTipo: servicio?.tipo || 'N/A'
      };
    });

  return {
    id: reportId,
    nombreReporte: ReportType.CITAS,
    fecha_generacion,
    desde,
    hasta,
    total_citas: citasFiltradas.length,
    total_atendido: citasFiltradas.filter(c => c.estado === CitaEstado.ATENDIDO).length,
    total_cancelado: citasFiltradas.filter(c => c.estado === CitaEstado.CANCELADO).length,
    total_reprogramado: citasFiltradas.filter(c => c.estado === CitaEstado.REPROGRAMADO).length,
    total_no_asistio: citasFiltradas.filter(c => c.estado === CitaEstado.NO_ASISTIO).length,
    rows: citasFiltradas
  };
};

// Reporte de Pacientes (Real - Backend)
const generatePacientesReport = async (reportId, fecha_generacion, desde, hasta, accessToken) => {
  try {
    const response = await fetch(`${API_URL}/pacientes/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const pacientes = data.results || data;
    
    const pacientesFiltrados = pacientes.filter(p => 
      isInDateRange(p.created_at?.split('T')[0], desde, hasta)
    );

    return {
      id: reportId,
      nombreReporte: ReportType.PACIENTES,
      fecha_generacion,
      desde,
      hasta,
      total_pacientes: pacientesFiltrados.length,
      rows: pacientesFiltrados.map(p => ({
        id: p.id,
        nombre: p.nombre_completo || `${p.nombres} ${p.apellidos}`,
        fecha_nacimiento: p.fecha_nacimiento,
        fecha_registro: p.created_at?.split('T')[0] || p.created_at,
        telefono: p.telefono,
        celular: p.celular,
        email: p.email,
        direccion: p.direccion,
        alergias: p.datos_medicos?.alergias ? [p.datos_medicos.alergias] : [],
        medicamentos: p.datos_medicos?.medicamentos ? [p.datos_medicos.medicamentos] : []
      }))
    };
  } catch (error) {
    console.error('Error obteniendo pacientes:', error);
    throw new Error('Error al obtener datos de pacientes');
  }
};

// Reporte de Historial Clínico (Real - Backend)
const generateHistorialClinicoReport = async (reportId, fecha_generacion, desde, hasta, pacienteId, accessToken) => {
  try {
    if (!pacienteId) {
      throw new Error('Se requiere seleccionar un paciente para el historial clínico');
    }

    const response = await fetch(`${API_URL}/pacientes/${pacienteId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const paciente = await response.json();

    // Mock de fichas clínicas basadas en datos médicos del paciente
    const fichasClinicas = [
      {
        id: `ficha-${pacienteId}-1`,
        pacienteId: pacienteId,
        fechaCreacion: paciente.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        motivo: 'Consulta inicial',
        ultimaVisita: paciente.datos_medicos?.ultimaVisita || 'N/A',
        diagnostico: 'Evaluación general',
        planTratamiento: 'Seguimiento según necesidad',
        observaciones: 'Paciente en buen estado general',
        pacienteNombre: paciente.nombre_completo || `${paciente.nombres} ${paciente.apellidos}`
      }
    ];

    const fichasFiltradas = fichasClinicas.filter(f => 
      isInDateRange(f.fechaCreacion, desde, hasta)
    );

    return {
      id: reportId,
      nombreReporte: ReportType.HISTORIAL_CLINICO,
      fecha_generacion,
      desde,
      hasta,
      total_fichas: fichasFiltradas.length,
      rows: fichasFiltradas
    };
  } catch (error) {
    console.error('Error obteniendo historial clínico:', error);
    throw new Error('Error al obtener historial clínico del paciente');
  }
};

// Reporte de Facturación (Real - Backend)
const generateFacturacionReport = async (reportId, fecha_generacion, desde, hasta, accessToken) => {
  try {
    const response = await fetch(`${API_URL}/facturacion/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const facturas = data.results || data;
    
    const facturasFiltradas = facturas.filter(f => 
      isInDateRange(f.fecha_emision, desde, hasta)
    );

    const facturacionRows = [];
    facturasFiltradas.forEach(factura => {
      factura.detalles?.forEach(detalle => {
        facturacionRows.push({
          facturaId: factura.idfactura,
          facturaCorrelativo: factura.idfactura,
          facturaFecha: factura.fecha_emision,
          facturaPrecioTotal: parseFloat(factura.monto_total),
          pacienteNombre: factura.paciente ? 
            `${factura.paciente.nombres} ${factura.paciente.apellidos}` : 
            'Sin paciente asignado',
          facturaEstado: factura.estado,
          descripcion: detalle.descripcion,
          cantidad: detalle.cantidad,
          precioUnitario: parseFloat(detalle.precio_unitario),
          precioTotal: parseFloat(detalle.precio_unitario) * detalle.cantidad
        });
      });
    });

    const totalRecaudado = facturasFiltradas
      .filter(f => f.estado === 'Pagada')
      .reduce((sum, f) => sum + parseFloat(f.monto_total), 0);

    const totalPendiente = facturasFiltradas
      .filter(f => f.estado === 'Pendiente')
      .reduce((sum, f) => sum + parseFloat(f.monto_total), 0);

    return {
      id: reportId,
      nombreReporte: ReportType.FACTURACION,
      fecha_generacion,
      desde,
      hasta,
      total_facturas_periodo: facturasFiltradas.length,
      total_recaudado_periodo: totalRecaudado,
      total_pendiente_periodo: totalPendiente,
      rows: facturacionRows
    };
  } catch (error) {
    console.error('Error obteniendo facturación:', error);
    throw new Error('Error al obtener datos de facturación');
  }
};

// Reporte de Encuestas (Mock)
const generateEncuestasReport = async (reportId, fecha_generacion, desde, hasta) => {
  const encuestasFiltradas = mockEncuestas
    .filter(e => isInDateRange(e.fecha, desde, hasta))
    .map(e => {
      const servicio = mockServicios.find(s => s.id === e.servicioId);
      return {
        ...e,
        servicioNombre: servicio?.nombre || 'N/A',
        servicioTipo: servicio?.tipo || 'N/A'
      };
    });

  const totalPuntuacion = encuestasFiltradas.reduce((sum, e) => sum + e.puntuacionGeneral, 0);

  return {
    id: reportId,
    nombreReporte: ReportType.ENCUESTAS_SATISFACCION,
    fecha_generacion,
    desde,
    hasta,
    total_encuestas: encuestasFiltradas.length,
    promedio_puntuacion: encuestasFiltradas.length > 0 ? totalPuntuacion / encuestasFiltradas.length : 0,
    rows: encuestasFiltradas
  };
};

// Reporte de Stock de Insumos (Real - Backend)
const generateStockReport = async (reportId, fecha_generacion, desde, hasta, accessToken) => {
  try {
    const response = await fetch(`${API_URL}/inventario/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const insumos = data.results || data;
    
    const insumosActivos = insumos.filter(i => i.activo);

    return {
      id: reportId,
      nombreReporte: ReportType.STOCK_INSUMOS,
      fecha_generacion,
      desde,
      hasta,
      total_productos_distintos: insumosActivos.length,
      valor_total_stock: 0, // No calculado por ahora
      rows: insumosActivos.map(i => ({
        id: i.id,
        nombre: i.nombre,
        descripcion: i.descripcion,
        stockActual: i.stock_actual,
        stockMinimo: 0, // No disponible en el modelo actual
        unidadMedida: 'unidad', // Default
        proveedor: 'N/A', // No disponible en el modelo actual
        fechaCaducidad: null // No disponible en el modelo actual
      }))
    };
  } catch (error) {
    console.error('Error obteniendo stock:', error);
    throw new Error('Error al obtener datos de stock');
  }
};

// Reporte de Movimientos de Inventario (Real - Backend)
const generateMovimientosReport = async (reportId, fecha_generacion, desde, hasta, accessToken) => {
  try {
    const response = await fetch(`${API_URL}/inventario/movimientos/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const movimientos = data.results || data;
    
    const movimientosFiltrados = movimientos.filter(m => 
      isInDateRange(m.fecha, desde, hasta)
    );

    const totalEntradas = movimientosFiltrados
      .filter(m => m.tipo === 'entrada')
      .reduce((sum, m) => sum + m.cantidad, 0);

    const totalSalidas = movimientosFiltrados
      .filter(m => m.tipo === 'salida')
      .reduce((sum, m) => sum + m.cantidad, 0);

    return {
      id: reportId,
      nombreReporte: ReportType.MOVIMIENTOS_INVENTARIO,
      fecha_generacion,
      desde,
      hasta,
      total_cambios: movimientosFiltrados.length,
      total_entradas_cantidad: totalEntradas,
      total_salidas_cantidad: totalSalidas,
      rows: movimientosFiltrados.map(m => ({
        id: m.id,
        fecha: m.fecha,
        tipo: m.tipo,
        cantidad: m.cantidad,
        motivo: m.motivo || 'N/A',
        insumoNombre: 'Insumo', // Se podría obtener del insumo relacionado
        responsableNombre: 'Usuario' // Se podría obtener del usuario relacionado
      }))
    };
  } catch (error) {
    console.error('Error obteniendo movimientos:', error);
    throw new Error('Error al obtener datos de movimientos de inventario');
  }
};

// Función para obtener pacientes (para el selector)
export const getPacientes = async (accessToken) => {
  try {
    const response = await fetch(`${API_URL}/pacientes/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const pacientes = data.results || data;
    
    return pacientes.map(p => ({
      id: p.id,
      nombre: p.nombre_completo || `${p.nombres} ${p.apellidos}`,
      dui: p.dui,
      telefono: p.telefono
    }));
  } catch (error) {
    console.error('Error obteniendo pacientes:', error);
    return [];
  }
};
