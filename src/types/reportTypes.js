// Tipos para el módulo de reportes de DentiFIA
// Basado en clinical-reports-viewer pero adaptado a la estructura de DentiFIA

// Entidades principales
export const Paciente = {
  id: 'string',
  nombres: 'string',
  apellidos: 'string',
  dui: 'string',
  fecha_nacimiento: 'string', // YYYY-MM-DD
  sexo: 'string',
  telefono: 'string',
  celular: 'string',
  email: 'string',
  direccion: 'string',
  datos_medicos: 'object', // JSON con datos médicos
  activo: 'boolean',
  created_at: 'string',
  updated_at: 'string'
};

// Estados de citas (mock)
export const CitaEstado = {
  PROGRAMADA: 'Programada',
  ATENDIDO: 'Atendido',
  CANCELADO: 'Cancelado',
  REPROGRAMADO: 'Reprogramado',
  NO_ASISTIO: 'No Asistió'
};

// Cita médica (mock)
export const Cita = {
  id: 'string',
  pacienteId: 'string',
  fecha: 'string', // YYYY-MM-DD
  hora: 'string', // HH:MM
  servicioId: 'string',
  estado: 'string', // CitaEstado
  notas: 'string',
  doctorId: 'string'
};

// Factura (real - del backend)
export const Factura = {
  idfactura: 'string',
  fecha_emision: 'string', // YYYY-MM-DD
  monto_total: 'number',
  metodo_pago: 'string',
  estado: 'string',
  activo: 'boolean',
  paciente: 'object' // Relación opcional con Paciente
};

// Detalle de factura (real - del backend)
export const DetalleFactura = {
  idDetalleFactura: 'number',
  descripcion: 'string',
  precio_unitario: 'number',
  cantidad: 'number',
  factura: 'string' // ID de la factura
};

// Insumo (real - del backend)
export const Insumo = {
  id: 'number',
  nombre: 'string',
  descripcion: 'string',
  stock_actual: 'number',
  activo: 'boolean'
};

// Movimiento de stock (real - del backend)
export const MovimientoStock = {
  id: 'number',
  insumo: 'number', // ID del insumo
  tipo: 'string', // 'entrada' o 'salida'
  cantidad: 'number',
  fecha: 'string', // YYYY-MM-DD
  motivo: 'string',
  usuario: 'number' // ID del usuario
};

// Encuesta de satisfacción (mock)
export const Encuesta = {
  id: 'string',
  pacienteId: 'string',
  servicioId: 'string',
  fecha: 'string', // YYYY-MM-DD
  puntuacionGeneral: 'number', // 1-5
  comentarios: 'string',
  preguntas: 'array' // Preguntas específicas
};

// Servicio (mock)
export const Servicio = {
  id: 'string',
  nombre: 'string',
  tipo: 'string',
  duracionEstimadaMin: 'number',
  costoBase: 'number'
};

// Tipos de reportes disponibles
export const ReportType = {
  CITAS: 'Reporte de Citas',
  HISTORIAL_CLINICO: 'Reporte de Historial Clínico',
  PACIENTES: 'Listado de Pacientes',
  FACTURACION: 'Reporte de Facturación',
  ENCUESTAS_SATISFACCION: 'Reporte de Encuestas de Satisfacción',
  STOCK_INSUMOS: 'Reporte de Stock de Insumos',
  MOVIMIENTOS_INVENTARIO: 'Reporte de Movimientos de Inventario'
};

// Estructura base de reporte
export const ReporteBase = {
  id: 'string',
  nombreReporte: 'string', // ReportType
  fecha_generacion: 'string', // ISOString
  desde: 'string', // YYYY-MM-DD
  hasta: 'string' // YYYY-MM-DD
};

// Reporte de Citas
export const ReporteCitasData = {
  ...ReporteBase,
  total_citas: 'number',
  total_atendido: 'number',
  total_cancelado: 'number',
  total_reprogramado: 'number',
  total_no_asistio: 'number',
  rows: 'array' // Citas con datos de paciente y servicio
};

// Reporte de Pacientes
export const ReportePacientesData = {
  ...ReporteBase,
  total_pacientes: 'number',
  rows: 'array' // Pacientes filtrados
};

// Reporte de Historial Clínico
export const ReporteHistorialClinicoData = {
  ...ReporteBase,
  total_fichas: 'number',
  rows: 'array' // Fichas clínicas con datos de paciente
};

// Reporte de Facturación
export const ReporteFacturacionData = {
  ...ReporteBase,
  total_facturas_periodo: 'number',
  total_recaudado_periodo: 'number',
  total_pendiente_periodo: 'number',
  rows: 'array' // Detalles de facturas con datos de paciente
};

// Reporte de Encuestas
export const ReporteEncuestasData = {
  ...ReporteBase,
  total_encuestas: 'number',
  promedio_puntuacion: 'number',
  rows: 'array' // Encuestas con datos de paciente y servicio
};

// Reporte de Stock
export const ReporteStockData = {
  ...ReporteBase,
  total_productos_distintos: 'number',
  valor_total_stock: 'number',
  rows: 'array' // Insumos con stock actual
};

// Reporte de Movimientos de Inventario
export const ReporteMovimientosData = {
  ...ReporteBase,
  total_cambios: 'number',
  total_entradas_cantidad: 'number',
  total_salidas_cantidad: 'number',
  rows: 'array' // Movimientos con datos de insumo y usuario
};

// Unión de todos los tipos de reporte
export const AnyReportData = 
  ReporteCitasData |
  ReportePacientesData |
  ReporteHistorialClinicoData |
  ReporteFacturacionData |
  ReporteEncuestasData |
  ReporteStockData |
  ReporteMovimientosData;

// Opción de reporte para el selector
export const ReportOption = {
  value: 'string', // ReportType
  label: 'string'
};
