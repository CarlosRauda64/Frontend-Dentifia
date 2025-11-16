// Servicio de reportes para DentiFIA
// Integra datos reales del backend con datos mock para módulos faltantes

import { API_URL } from '../api/api';
import { ReportType } from '../types/reportTypes';
// NOTA: CitaEstado fue removido porque el modelo Cita no tiene campo 'estado'

// Datos mock para módulos faltantes
const mockServicios = [
  { id: 's-1', nombre: 'Consulta General', tipo: 'Consulta', duracionEstimadaMin: 30, costoBase: 50 },
  { id: 's-2', nombre: 'Limpieza Dental', tipo: 'Procedimiento', duracionEstimadaMin: 45, costoBase: 75 },
  { id: 's-3', nombre: 'Ortodoncia - Revisión', tipo: 'Ortodoncia', duracionEstimadaMin: 20, costoBase: 60 },
  { id: 's-4', nombre: 'Blanqueamiento Dental', tipo: 'Estética', duracionEstimadaMin: 90, costoBase: 200 },
  { id: 's-5', nombre: 'Extracción Simple', tipo: 'Cirugía', duracionEstimadaMin: 60, costoBase: 120 },
];

// Datos mock temporales para reporte de citas
// NOTA: Estos datos usan la estructura real del modelo Cita del backend.
// Estructura basada en Dentifia-Backend/citas/models.py
// Campos: id, paciente (FK), nombre_completo, fecha_hora, motivo, created_at, updated_at
// NOTA: El modelo actual NO tiene campos 'estado', 'doctor', ni 'servicio'
const mockCitas = [
  { 
    id: 1, 
    paciente: { id: 1, nombres: 'Juan', apellidos: 'Pérez' }, 
    nombre_completo: 'Juan Pérez',
    fecha_hora: '2024-07-01T09:00:00Z', 
    motivo: 'Control anual',
    created_at: '2024-06-25T10:00:00Z',
    updated_at: '2024-06-25T10:00:00Z'
  },
  { 
    id: 2, 
    paciente: { id: 2, nombres: 'María', apellidos: 'González' }, 
    nombre_completo: 'María González',
    fecha_hora: '2024-07-01T10:00:00Z', 
    motivo: 'Limpieza dental',
    created_at: '2024-06-25T11:00:00Z',
    updated_at: '2024-06-25T11:00:00Z'
  },
  { 
    id: 3, 
    paciente: { id: 3, nombres: 'Carlos', apellidos: 'Rodríguez' }, 
    nombre_completo: 'Carlos Rodríguez',
    fecha_hora: '2024-07-02T11:00:00Z', 
    motivo: 'Consulta general',
    created_at: '2024-06-26T09:00:00Z',
    updated_at: '2024-06-26T09:00:00Z'
  },
  { 
    id: 4, 
    paciente: { id: 1, nombres: 'Juan', apellidos: 'Pérez' }, 
    nombre_completo: 'Juan Pérez',
    fecha_hora: '2024-07-08T09:00:00Z', 
    motivo: 'Seguimiento',
    created_at: '2024-07-01T10:00:00Z',
    updated_at: '2024-07-01T10:00:00Z'
  },
  { 
    id: 5, 
    paciente: { id: 4, nombres: 'Ana', apellidos: 'Martínez' }, 
    nombre_completo: 'Ana Martínez',
    fecha_hora: '2024-07-10T14:00:00Z', 
    motivo: 'Blanqueamiento',
    created_at: '2024-07-05T08:00:00Z',
    updated_at: '2024-07-05T08:00:00Z'
  },
  { 
    id: 6, 
    paciente: { id: 2, nombres: 'María', apellidos: 'González' }, 
    nombre_completo: 'María González',
    fecha_hora: '2023-12-15T15:00:00Z', 
    motivo: 'Extracción muela del juicio',
    created_at: '2023-12-10T10:00:00Z',
    updated_at: '2023-12-10T10:00:00Z'
  },
  { 
    id: 7, 
    paciente: { id: 3, nombres: 'Carlos', apellidos: 'Rodríguez' }, 
    nombre_completo: 'Carlos Rodríguez',
    fecha_hora: '2024-06-20T08:30:00Z', 
    motivo: 'Consulta de rutina',
    created_at: '2024-06-15T14:00:00Z',
    updated_at: '2024-06-15T14:00:00Z'
  },
];

// Datos mock temporales para reporte de encuestas
// NOTA: Estos datos usan la estructura real del modelo Encuesta del backend.
// Estructura basada en Dentifia-Backend/encuestas/models.py
// Campos: id, observaciones, nivel_satisfaccion
// NOTA: El modelo actual NO tiene campos 'paciente', 'servicio', ni 'fecha'
// Si se requieren estos campos, deben agregarse primero al modelo Django.
const mockEncuestas = [
  { 
    id: 1, 
    observaciones: 'Excelente atención, muy profesional.',
    nivel_satisfaccion: 5
  },
  { 
    id: 2, 
    observaciones: 'Todo bien, aunque la espera fue un poco larga.',
    nivel_satisfaccion: 4
  },
  { 
    id: 3, 
    observaciones: 'Siempre satisfecho con el servicio.',
    nivel_satisfaccion: 5
  },
  { 
    id: 4, 
    observaciones: 'El procedimiento fue doloroso pero el resultado es bueno.',
    nivel_satisfaccion: 3
  },
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
export const generateReport = async (reportType, desde, hasta, filters = {}, accessToken = null) => {
  const reportId = `REP-${Date.now()}`;
  const fecha_generacion = new Date().toISOString();
  // Límite máximo de recuperaciones (por defecto 20, excepto para historial clínico)
  const limiteMaximo = filters.limiteMaximo !== undefined ? filters.limiteMaximo : 20;

  try {
    switch (reportType) {
      case ReportType.CITAS:
        return await generateCitasReport(reportId, fecha_generacion, desde, hasta, filters.pacienteId, filters.estado, limiteMaximo, accessToken);
      
      case ReportType.PACIENTES:
        return await generatePacientesReport(
          reportId, 
          fecha_generacion, 
          desde, 
          hasta, 
          filters.rangoEdad, 
          filters.busquedaNombre,
          limiteMaximo,
          accessToken
        );
      
      case ReportType.HISTORIAL_CLINICO:
        return await generateHistorialClinicoReport(
          reportId, 
          fecha_generacion, 
          desde, 
          hasta, 
          filters.pacienteId || null, 
          accessToken
        );
      
      case ReportType.FACTURACION:
        return await generateFacturacionReport(
          reportId, 
          fecha_generacion, 
          desde, 
          hasta, 
          filters.estadoFactura,
          filters.metodoPago,
          filters.montoMinimo,
          filters.montoMaximo,
          filters.pacienteId,
          limiteMaximo,
          accessToken
        );
      
      case ReportType.ENCUESTAS_SATISFACCION:
        return await generateEncuestasReport(reportId, fecha_generacion, desde, hasta, limiteMaximo, accessToken);
      
      case ReportType.STOCK_INSUMOS:
        return await generateStockReport(
          reportId, 
          fecha_generacion, 
          desde, 
          hasta, 
          filters.stockBajo,
          filters.busquedaInsumo,
          limiteMaximo,
          accessToken
        );
      
      case ReportType.MOVIMIENTOS_INVENTARIO:
        return await generateMovimientosReport(
          reportId, 
          fecha_generacion, 
          desde, 
          hasta, 
          filters.tipoMovimiento,
          filters.estadoMovimiento,
          filters.usuarioMovimiento,
          filters.busquedaInsumo,
          limiteMaximo,
          accessToken
        );
      
      default:
        throw new Error(`Tipo de reporte no implementado: ${reportType}`);
    }
  } catch (error) {
    console.error('Error generando reporte:', error);
    throw error;
  }
};

// Reporte de Citas (Real - Backend)
const generateCitasReport = async (reportId, fecha_generacion, desde, hasta, pacienteId = null, estado = null, limiteMaximo = 20, accessToken = null) => {
  try {
    // Construir URL con filtros
    let url = `${API_URL}/citas/listar/`;
    const params = new URLSearchParams();
    
    if (desde) params.append('desde', desde);
    if (hasta) params.append('hasta', hasta);
    if (pacienteId && pacienteId !== '' && pacienteId !== 'undefined' && pacienteId !== null) {
      params.append('paciente_id', pacienteId);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    let citas = await response.json();
    
    // Filtrar por estado si se especifica (filtro en frontend ya que el backend no lo soporta)
    if (estado && estado !== '') {
      citas = citas.filter(c => c.estado === estado);
    }
    
    // Aplicar límite máximo de recuperaciones
    if (limiteMaximo && limiteMaximo > 0) {
      citas = citas.slice(0, limiteMaximo);
    }
    
    // Formatear citas para el reporte
    const citasFormateadas = citas.map(c => ({
      id: c.id,
      nombre_completo: c.nombre_completo || (c.paciente_nombres && c.paciente_apellidos ? `${c.paciente_nombres} ${c.paciente_apellidos}`.trim() : 'Sin paciente'),
      fecha_hora: c.fecha_hora,
      motivo: c.motivo || '',
      doctor_nombre: c.doctor_nombre || 'Sin asignar',
      estado: c.estado || 'programada',
      created_at: c.created_at,
      updated_at: c.updated_at
    }));

    // Calcular contadores por estado
    const total_atendido = citasFormateadas.filter(c => c.estado === 'atendida').length;
    const total_cancelado = citasFormateadas.filter(c => c.estado === 'cancelada').length;
    const total_reprogramado = citasFormateadas.filter(c => c.estado === 'reprogramada').length;
    const total_no_asistio = citasFormateadas.filter(c => c.estado === 'no_asistio').length;
    const total_programada = citasFormateadas.filter(c => c.estado === 'programada').length;

    return {
      id: reportId,
      nombreReporte: ReportType.CITAS,
      fecha_generacion,
      desde,
      hasta,
      total_citas: citasFormateadas.length,
      total_programada,
      total_atendido,
      total_cancelado,
      total_reprogramado,
      total_no_asistio,
      rows: citasFormateadas
    };
  } catch (error) {
    console.error('Error obteniendo citas:', error);
    throw new Error('Error al obtener datos de citas');
  }
};

// Reporte de Pacientes (Real - Backend)
const generatePacientesReport = async (reportId, fecha_generacion, desde, hasta, rangoEdad, busquedaNombre, limiteMaximo = 20, accessToken) => {
  try {
    // Obtener todos los pacientes con paginación para asegurar datos completos
    let allPacientes = [];
    let nextUrl = `${API_URL}/pacientes/`;
    
    // Recorrer todas las páginas para obtener todos los pacientes
    while (nextUrl) {
      const response = await fetch(nextUrl, {
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
      const pacientes = data.results || (Array.isArray(data) ? data : []);
      allPacientes = allPacientes.concat(pacientes);
      
      // Verificar si hay siguiente página
      nextUrl = data.next || null;
    }
    
    // Ahora obtener los datos completos de cada paciente (con serializer completo)
    const pacientesCompletos = await Promise.all(
      allPacientes.map(async (p) => {
        try {
          const detailResponse = await fetch(`${API_URL}/pacientes/${p.id}/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          if (detailResponse.ok) {
            return await detailResponse.json();
          }
          // Si falla, usar los datos básicos
          return p;
        } catch (error) {
          console.warn(`Error obteniendo detalles del paciente ${p.id}:`, error);
          return p;
        }
      })
    );
    
    // Aplicar filtros
    let pacientesFiltrados = pacientesCompletos.filter(p => 
      isInDateRange(p.created_at?.split('T')[0], desde, hasta)
    );

    // Filtro por rango de edad
    if (rangoEdad) {
      pacientesFiltrados = pacientesFiltrados.filter(p => {
        const edad = p.edad || calcularEdad(p.fecha_nacimiento);
        switch (rangoEdad) {
          case '0-18':
            return edad >= 0 && edad <= 18;
          case '19-35':
            return edad >= 19 && edad <= 35;
          case '36-50':
            return edad >= 36 && edad <= 50;
          case '51-65':
            return edad >= 51 && edad <= 65;
          case '65+':
            return edad >= 65;
          default:
            return true;
        }
      });
    }

    // Filtro por búsqueda de nombre
    if (busquedaNombre) {
      const busqueda = busquedaNombre.toLowerCase();
      pacientesFiltrados = pacientesFiltrados.filter(p => {
        const nombreCompleto = `${p.nombres || ''} ${p.apellidos || ''}`.toLowerCase();
        return nombreCompleto.includes(busqueda);
      });
    }

    // Obtener todas las facturas una sola vez (más eficiente)
    let todasFacturas = [];
    try {
      const facturasResponse = await fetch(`${API_URL}/facturacion/facturas/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (facturasResponse.ok) {
        const facturasData = await facturasResponse.json();
        todasFacturas = Array.isArray(facturasData) ? facturasData : (facturasData.results || []);
      }
    } catch (error) {
      console.warn('Error obteniendo facturas:', error);
    }
    
    // Obtener estadísticas de citas y facturas para cada paciente
    const pacientesConEstadisticas = await Promise.all(
      pacientesFiltrados.map(async (p) => {
        try {
          // Obtener citas del paciente
          const citasResponse = await fetch(`${API_URL}/citas/listar/?paciente_id=${p.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          let citas = [];
          if (citasResponse.ok) {
            citas = await citasResponse.json();
          }
          
          // Filtrar facturas por paciente desde la lista completa
          // El campo paciente se serializa como ID numérico cuando es ForeignKey
          const facturas = todasFacturas.filter(f => {
            if (!f.paciente) return false; // Si no tiene paciente asignado, no cuenta
            
            // El campo paciente puede ser:
            // - Un número (ID directo)
            // - Un objeto con propiedad id
            // - null/undefined
            const pacienteId = f.paciente;
            
            if (typeof pacienteId === 'number') {
              return pacienteId === p.id;
            }
            
            if (typeof pacienteId === 'object' && pacienteId !== null) {
              return pacienteId.id === p.id;
            }
            
            // Comparación por string como fallback
            return String(pacienteId) === String(p.id);
          });
          
          // Calcular estadísticas
          // Total de citas: todas las citas del paciente
          const totalCitas = citas.length;
          
          // Total de citas atendidas: solo las que tienen estado 'atendida'
          const totalCitasAtendidas = citas.filter(c => {
            const estado = c.estado || '';
            return estado.toLowerCase() === 'atendida';
          }).length;
          
          // Total de facturas: todas las facturas del paciente
          const totalFacturas = facturas.length;
          
          // Total facturado: suma de montos de facturas con estado 'Pagada'
          const totalFacturado = facturas
            .filter(f => {
              const estado = f.estado || '';
              return estado.toLowerCase() === 'pagada';
            })
            .reduce((sum, f) => {
              const monto = parseFloat(f.monto_total || 0);
              return sum + (isNaN(monto) ? 0 : monto);
            }, 0);
          
          return {
            id: p.id,
            nombre: p.nombre_completo || `${p.nombres || ''} ${p.apellidos || ''}`.trim(),
            dui: p.dui || '',
            fecha_nacimiento: p.fecha_nacimiento || null,
            fecha_registro: p.created_at?.split('T')[0] || p.created_at || null,
            total_citas: totalCitas,
            total_citas_atendidas: totalCitasAtendidas,
            total_facturas: totalFacturas,
            total_facturado: totalFacturado
          };
        } catch (error) {
          console.warn(`Error obteniendo estadísticas del paciente ${p.id}:`, error);
          // Retornar datos básicos sin estadísticas
          return {
            id: p.id,
            nombre: p.nombre_completo || `${p.nombres || ''} ${p.apellidos || ''}`.trim(),
            dui: p.dui || '',
            fecha_nacimiento: p.fecha_nacimiento || null,
            fecha_registro: p.created_at?.split('T')[0] || p.created_at || null,
            total_citas: 0,
            total_citas_atendidas: 0,
            total_facturas: 0,
            total_facturado: 0
          };
        }
      })
    );
    
    // Aplicar límite máximo de recuperaciones
    let pacientesLimitados = pacientesConEstadisticas;
    if (limiteMaximo && limiteMaximo > 0) {
      pacientesLimitados = pacientesConEstadisticas.slice(0, limiteMaximo);
    }
    
    return {
      id: reportId,
      nombreReporte: ReportType.PACIENTES,
      fecha_generacion,
      desde,
      hasta,
      total_pacientes: pacientesLimitados.length,
      rows: pacientesLimitados
    };
  } catch (error) {
    console.error('Error obteniendo pacientes:', error);
    throw new Error('Error al obtener datos de pacientes');
  }
};

// Función auxiliar para calcular edad
const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return 0;
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};

// Reporte de Historial Clínico (Real - Backend)
// Consolida datos de pacientes, expedientes y fichas clínicas
const generateHistorialClinicoReport = async (reportId, fecha_generacion, desde, hasta, pacienteId, accessToken) => {
  try {
    if (!pacienteId) {
      throw new Error('Se requiere seleccionar un paciente para el historial clínico');
    }

    // Obtener datos del paciente
    const pacienteResponse = await fetch(`${API_URL}/pacientes/${pacienteId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!pacienteResponse.ok) {
      throw new Error(`Error ${pacienteResponse.status}: ${pacienteResponse.statusText}`);
    }
    
    const paciente = await pacienteResponse.json();

    // Obtener expedientes del paciente
    let expedientes = [];
    try {
      const expedientesResponse = await fetch(`${API_URL}/expediente/expedientes/?paciente=${pacienteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (expedientesResponse.ok) {
        const expedientesData = await expedientesResponse.json();
        expedientes = Array.isArray(expedientesData) ? expedientesData : (expedientesData.results || []);
      }
    } catch (error) {
      console.warn('Error obteniendo expedientes:', error);
    }

    // Obtener fichas de ortodoncia para cada expediente
    const fichasClinicas = [];
    for (const expediente of expedientes) {
      try {
        // Usar el endpoint correcto: /expediente/fichas-ortodoncia/ con filtro expediente
        const fichasResponse = await fetch(`${API_URL}/expediente/fichas-ortodoncia/?expediente=${expediente.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (fichasResponse.ok) {
          const fichasData = await fichasResponse.json();
          const fichas = Array.isArray(fichasData) ? fichasData : (fichasData.results || []);
          
          fichas.forEach(ficha => {
            fichasClinicas.push({
              id: ficha.id,
              expediente_id: expediente.id,
              numero_expediente: expediente.numero_expediente,
              pacienteId: pacienteId,
              fechaCreacion: ficha.created_at?.split('T')[0] || expediente.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
              motivo_consulta: ficha.motivo_consulta_inicial || 'N/A',
              diagnostico: ficha.diagnostico || 'N/A',
              oclusion: ficha.oclusion || 'N/A',
              mordida: ficha.mordida || 'N/A',
              plan_tratamiento: ficha.plan_tratamiento || 'N/A',
              estado_tratamiento: ficha.estado_tratamiento || 'N/A',
              pacienteNombre: paciente.nombre_completo || `${paciente.nombres} ${paciente.apellidos}`
            });
          });
        }
      } catch (error) {
        console.warn(`Error obteniendo fichas para expediente ${expediente.id}:`, error);
      }
    }

    // Si no hay fichas, crear una entrada con datos básicos del paciente
    if (fichasClinicas.length === 0) {
      fichasClinicas.push({
        id: `ficha-${pacienteId}-basica`,
        expediente_id: expedientes[0]?.id || null,
        numero_expediente: expedientes[0]?.numero_expediente || 'Sin expediente',
        pacienteId: pacienteId,
        fechaCreacion: paciente.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        motivo_consulta: 'Consulta inicial',
        diagnostico: 'Evaluación general',
        oclusion: 'N/A',
        mordida: 'N/A',
        plan_tratamiento: 'Seguimiento según necesidad',
        estado_tratamiento: 'N/A',
        pacienteNombre: paciente.nombre_completo || `${paciente.nombres} ${paciente.apellidos}`
      });
    }

    // Filtrar por rango de fechas
    const fichasFiltradas = fichasClinicas.filter(f => 
      isInDateRange(f.fechaCreacion, desde, hasta)
    );

    // Consolidar datos personales y antecedentes
    const datosConsolidados = {
      paciente: {
        id: paciente.id,
        nombres: paciente.nombres,
        apellidos: paciente.apellidos,
        nombre_completo: paciente.nombre_completo || `${paciente.nombres} ${paciente.apellidos}`,
        dui: paciente.dui || '',
        fecha_nacimiento: paciente.fecha_nacimiento,
        sexo: paciente.sexo || '',
        telefono: paciente.telefono,
        celular: paciente.celular || '',
        email: paciente.email || '',
        direccion: paciente.direccion || ''
      },
      antecedentes: paciente.datos_medicos || {},
      expedientes: expedientes.map(e => ({
        id: e.id,
        numero_expediente: e.numero_expediente,
        created_at: e.created_at
      })),
      total_fichas: fichasFiltradas.length
    };

    return {
      id: reportId,
      nombreReporte: ReportType.HISTORIAL_CLINICO,
      fecha_generacion,
      desde,
      hasta,
      total_fichas: fichasFiltradas.length,
      datos_consolidados: datosConsolidados,
      rows: fichasFiltradas
    };
  } catch (error) {
    console.error('Error obteniendo historial clínico:', error);
    throw new Error('Error al obtener historial clínico del paciente');
  }
};

// Reporte de Facturación (Real - Backend)
const generateFacturacionReport = async (reportId, fecha_generacion, desde, hasta, estadoFactura, metodoPago, montoMinimo, montoMaximo, pacienteId, limiteMaximo = 20, accessToken) => {
  try {
    const response = await fetch(`${API_URL}/facturacion/facturas/`, {
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
    const facturas = Array.isArray(data) ? data : (data.results || []);
    
    // Aplicar filtros
    let facturasFiltradas = facturas.filter(f => 
      isInDateRange(f.fecha_emision, desde, hasta)
    );

    // Filtro por estado
    if (estadoFactura) {
      facturasFiltradas = facturasFiltradas.filter(f => f.estado === estadoFactura);
    }

    // Filtro por método de pago
    if (metodoPago) {
      facturasFiltradas = facturasFiltradas.filter(f => f.metodo_pago === metodoPago);
    }

    // Filtro por rango de monto
    if (montoMinimo) {
      facturasFiltradas = facturasFiltradas.filter(f => parseFloat(f.monto_total) >= parseFloat(montoMinimo));
    }
    if (montoMaximo) {
      facturasFiltradas = facturasFiltradas.filter(f => parseFloat(f.monto_total) <= parseFloat(montoMaximo));
    }

    // Filtro por paciente
    if (pacienteId) {
      facturasFiltradas = facturasFiltradas.filter(f => f.paciente == pacienteId);
    }

    const facturacionRows = [];
    facturasFiltradas.forEach(factura => {
      factura.detalles?.forEach(detalle => {
        facturacionRows.push({
          facturaId: factura.idfactura,
          facturaCorrelativo: factura.idfactura,
          facturaFecha: factura.fecha_emision,
          facturaPrecioTotal: parseFloat(factura.monto_total),
          pacienteNombre: factura.paciente_nombre || 'Sin paciente asignado',
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

    // Aplicar límite máximo de recuperaciones
    let facturacionRowsLimitados = facturacionRows;
    if (limiteMaximo && limiteMaximo > 0) {
      facturacionRowsLimitados = facturacionRows.slice(0, limiteMaximo);
    }

    return {
      id: reportId,
      nombreReporte: ReportType.FACTURACION,
      fecha_generacion,
      desde,
      hasta,
      total_facturas_periodo: facturasFiltradas.length,
      total_recaudado_periodo: totalRecaudado,
      total_pendiente_periodo: totalPendiente,
      rows: facturacionRowsLimitados
    };
  } catch (error) {
    console.error('Error obteniendo facturación:', error);
    throw new Error('Error al obtener datos de facturación');
  }
};

// Reporte de Encuestas (Real - Backend)
const generateEncuestasReport = async (reportId, fecha_generacion, desde, hasta, limiteMaximo = 20, accessToken = null) => {
  try {
    const response = await fetch(`${API_URL}/encuestas/listar`, {
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
    let encuestas = Array.isArray(data) ? data : (data.results || []);
    
    // Filtrar por rango de fechas si se proporciona
    if (desde || hasta) {
      encuestas = encuestas.filter(e => {
        if (!e.fecha) return false;
        const fechaEncuesta = new Date(e.fecha);
        if (desde) {
          const desdeDate = new Date(desde);
          desdeDate.setHours(0, 0, 0, 0);
          if (fechaEncuesta < desdeDate) return false;
        }
        if (hasta) {
          const hastaDate = new Date(hasta);
          hastaDate.setHours(23, 59, 59, 999);
          if (fechaEncuesta > hastaDate) return false;
        }
        return true;
      });
    }
    
    const encuestasFormateadas = encuestas.map(e => {
      // Formatear preguntas_respuestas como lista numerada para mejor legibilidad
      let preguntasFormateadas = '';
      if (e.preguntas_respuestas && typeof e.preguntas_respuestas === 'object') {
        const preguntasArray = Object.entries(e.preguntas_respuestas).map(([pregunta, respuesta], index) => 
          `${index + 1}. ${pregunta}\n   → ${respuesta}`
        );
        preguntasFormateadas = preguntasArray.join('\n\n');
      }
      
      return {
        id: e.id,
        fecha: e.fecha || null,
        observaciones: e.observaciones || 'N/A',
        nivel_satisfaccion: `${e.nivel_satisfaccion || 0}/5`,
        preguntas_respuestas: preguntasFormateadas || 'N/A'
      };
    });

    // Aplicar límite máximo de recuperaciones
    let encuestasFormateadasLimitadas = encuestasFormateadas;
    if (limiteMaximo && limiteMaximo > 0) {
      encuestasFormateadasLimitadas = encuestasFormateadas.slice(0, limiteMaximo);
    }

    // Calcular promedio antes de formatear nivel_satisfaccion como string
    const encuestasParaPromedio = limiteMaximo && limiteMaximo > 0 ? encuestas.slice(0, limiteMaximo) : encuestas;
    const totalPuntuacion = encuestasParaPromedio.reduce((sum, e) => sum + (e.nivel_satisfaccion || 0), 0);
    const promedioPuntuacion = encuestasParaPromedio.length > 0 ? totalPuntuacion / encuestasParaPromedio.length : 0;

    return {
      id: reportId,
      nombreReporte: ReportType.ENCUESTAS_SATISFACCION,
      fecha_generacion,
      desde,
      hasta,
      total_encuestas: encuestasFormateadasLimitadas.length,
      promedio_puntuacion: promedioPuntuacion.toFixed(2),
      rows: encuestasFormateadasLimitadas
    };
  } catch (error) {
    console.error('Error obteniendo encuestas:', error);
    throw new Error('Error al obtener datos de encuestas');
  }
};

// Reporte de Stock de Insumos (Real - Backend)
const generateStockReport = async (reportId, fecha_generacion, desde, hasta, stockBajo, busquedaInsumo, limiteMaximo = 20, accessToken) => {
  try {
    const response = await fetch(`${API_URL}/inventario/insumos/`, {
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
    const insumos = Array.isArray(data) ? data : (data.results || []);
    
    // Aplicar filtros
    let insumosActivos = insumos.filter(i => i.activo);

    // Filtro por stock bajo
    if (stockBajo) {
      insumosActivos = insumosActivos.filter(i => (i.stock_actual || 0) < 10);
    }

    // Filtro por búsqueda de insumo
    if (busquedaInsumo) {
      const busqueda = busquedaInsumo.toLowerCase();
      insumosActivos = insumosActivos.filter(i => 
        i.nombre.toLowerCase().includes(busqueda) || 
        i.descripcion.toLowerCase().includes(busqueda)
      );
    }

    // Aplicar límite máximo de recuperaciones
    let insumosLimitados = insumosActivos;
    if (limiteMaximo && limiteMaximo > 0) {
      insumosLimitados = insumosActivos.slice(0, limiteMaximo);
    }

    return {
      id: reportId,
      nombreReporte: ReportType.STOCK_INSUMOS,
      fecha_generacion,
      desde: 'Estado actual', // Cambiado para indicar que es estado actual
      hasta: 'Estado actual', // Cambiado para indicar que es estado actual
      total_productos_distintos: insumosLimitados.length,
      valor_total_stock: 0, // No calculado por ahora
      rows: insumosLimitados.map(i => ({
        id: i.id,
        nombre: i.nombre,
        descripcion: i.descripcion,
        stockActual: i.stock_actual || 0
      }))
    };
  } catch (error) {
    console.error('Error obteniendo stock:', error);
    throw new Error('Error al obtener datos de stock');
  }
};

// Reporte de Movimientos de Inventario (Real - Backend)
const generateMovimientosReport = async (reportId, fecha_generacion, desde, hasta, tipoMovimiento, estadoMovimiento, usuarioMovimiento, busquedaInsumo, limiteMaximo = 20, accessToken) => {
  try {
    const response = await fetch(`${API_URL}/inventario/movimientos_stock/`, {
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
    
    // Aplicar filtros
    let movimientosFiltrados = movimientos.filter(m => 
      isInDateRange(m.fecha, desde, hasta)
    );

    // Filtro por tipo de movimiento
    if (tipoMovimiento) {
      movimientosFiltrados = movimientosFiltrados.filter(m => m.tipo === tipoMovimiento);
    }

    // Filtro por estado del movimiento
    if (estadoMovimiento) {
      const esRealizado = estadoMovimiento === 'realizado';
      movimientosFiltrados = movimientosFiltrados.filter(m => m.activo === esRealizado);
    }

    // Filtro por usuario
    if (usuarioMovimiento) {
      const busqueda = usuarioMovimiento.toLowerCase();
      movimientosFiltrados = movimientosFiltrados.filter(m => 
        (m.nombre_usuario || '').toLowerCase().includes(busqueda)
      );
    }

    // Filtro por búsqueda de insumo
    if (busquedaInsumo) {
      const busqueda = busquedaInsumo.toLowerCase();
      movimientosFiltrados = movimientosFiltrados.filter(m => 
        (m.insumo_data?.nombre || '').toLowerCase().includes(busqueda)
      );
    }

    // Aplicar límite máximo de recuperaciones
    let movimientosLimitados = movimientosFiltrados;
    if (limiteMaximo && limiteMaximo > 0) {
      movimientosLimitados = movimientosFiltrados.slice(0, limiteMaximo);
    }

    const totalEntradas = movimientosLimitados
      .filter(m => m.tipo === 'entrada')
      .reduce((sum, m) => sum + m.cantidad, 0);

    const totalSalidas = movimientosLimitados
      .filter(m => m.tipo === 'salida')
      .reduce((sum, m) => sum + m.cantidad, 0);

    return {
      id: reportId,
      nombreReporte: ReportType.MOVIMIENTOS_INVENTARIO,
      fecha_generacion,
      desde,
      hasta,
      total_cambios: movimientosLimitados.length,
      total_entradas_cantidad: totalEntradas,
      total_salidas_cantidad: totalSalidas,
      rows: movimientosLimitados.map(m => ({
        id: m.id,
        fecha: m.fecha,
        tipo: m.tipo,
        cantidad: m.cantidad,
        insumo: m.insumo_data?.nombre || 'Insumo no encontrado',
        nombreUsuario: m.nombre_usuario || 'N/A',
        rolUsuario: m.rol_usuario || 'N/A',
        estado: m.activo ? 'Realizado' : 'Cancelado'
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
