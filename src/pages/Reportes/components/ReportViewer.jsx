import React from 'react';
import { Button, Badge, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { HiDownload, HiDocumentReport, HiExclamation } from 'react-icons/hi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportViewer = ({ reportData }) => {
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

  // Función para obtener configuración del reporte según el tipo
  const getReportConfiguration = (reportData) => {
    const commonAttributes = [
      { label: "ID Reporte", value: reportData.id },
      { label: "Fecha de Generación", value: formatDate(reportData.fecha_generacion) },
    ];

    if (reportData.nombreReporte !== 'Reporte de Stock de Insumos' || 
        (reportData.desde !== '1970-01-01' && reportData.hasta !== new Date().toISOString().split('T')[0])) {
      commonAttributes.push({ label: "Periodo Desde", value: formatDate(reportData.desde) });
      commonAttributes.push({ label: "Periodo Hasta", value: formatDate(reportData.hasta) });
    }

    let specificAttributes = [];
    let columns = [];
    let data = [];

    switch (reportData.nombreReporte) {
      case 'Reporte de Citas':
        specificAttributes = [
          { label: "Total Citas", value: reportData.total_citas },
          { label: "Atendidas", value: reportData.total_atendido, badgeColor: "success" },
          { label: "Canceladas", value: reportData.total_cancelado, badgeColor: "failure" },
          { label: "Reprogramadas", value: reportData.total_reprogramado, badgeColor: "warning" },
          { label: "No Asistió", value: reportData.total_no_asistio, badgeColor: "info" },
        ];
        columns = [
          { header: 'Fecha', accessor: (row) => formatDate(row.fecha) },
          { header: 'Hora', accessor: 'hora' },
          { header: 'Servicio', accessor: 'servicioNombre' },
          { header: 'Estado', accessor: 'estado' },
          { header: 'Notas', accessor: 'notas' },
        ];
        data = reportData.rows;
        break;

      case 'Listado de Pacientes':
        specificAttributes = [{ label: "Total Pacientes", value: reportData.total_pacientes }];
        columns = [
          { header: 'Nombre', accessor: 'nombre' },
          { header: 'Fecha Nac.', accessor: (row) => formatDate(row.fecha_nacimiento) },
          { header: 'Fecha Registro', accessor: (row) => formatDate(row.fecha_registro) },
          { header: 'Teléfono', accessor: 'telefono' },
          { header: 'Email', accessor: 'email' },
          { header: 'Dirección', accessor: 'direccion' },
        ];
        data = reportData.rows;
        break;

      case 'Reporte de Historial Clínico':
        specificAttributes = [{ label: "Total Fichas", value: reportData.total_fichas }];
        columns = [
          { header: 'Paciente', accessor: 'pacienteNombre' },
          { header: 'Fecha Creación', accessor: (row) => formatDate(row.fechaCreacion) },
          { header: 'Motivo', accessor: 'motivo' },
          { header: 'Diagnóstico', accessor: 'diagnostico' },
          { header: 'Plan Tratamiento', accessor: 'planTratamiento' },
          { header: 'Observaciones', accessor: 'observaciones' },
        ];
        data = reportData.rows;
        break;

      case 'Reporte de Facturación':
        specificAttributes = [
          { label: "Facturas en Periodo", value: reportData.total_facturas_periodo },
          { label: "Total Recaudado", value: formatCurrency(reportData.total_recaudado_periodo), badgeColor: "success" },
          { label: "Total Pendiente", value: formatCurrency(reportData.total_pendiente_periodo), badgeColor: "warning" },
        ];
        columns = [
          { header: 'Factura #', accessor: 'facturaCorrelativo' },
          { header: 'Fecha', accessor: (row) => formatDate(row.facturaFecha) },
          { header: 'Paciente', accessor: 'pacienteNombre' },
          { header: 'Descripción', accessor: 'descripcion' },
          { header: 'Cant.', accessor: 'cantidad' },
          { header: 'Precio Unit.', accessor: (row) => formatCurrency(row.precioUnitario) },
          { header: 'Total', accessor: (row) => formatCurrency(row.precioTotal) },
          { header: 'Estado', accessor: 'facturaEstado' },
        ];
        data = reportData.rows;
        break;

      case 'Reporte de Encuestas de Satisfacción':
        specificAttributes = [
          { label: "Total Encuestas", value: reportData.total_encuestas },
          { label: "Promedio Puntuación", value: reportData.promedio_puntuacion.toFixed(2) },
        ];
        columns = [
          { header: 'Fecha', accessor: (row) => formatDate(row.fecha) },
          { header: 'Servicio', accessor: 'servicioNombre' },
          { header: 'Puntuación', accessor: 'puntuacionGeneral' },
          { header: 'Comentarios', accessor: 'comentarios' },
        ];
        data = reportData.rows;
        break;

      case 'Reporte de Stock de Insumos':
        specificAttributes = [
          { label: "Productos Distintos", value: reportData.total_productos_distintos },
        ];
        columns = [
          { header: 'Nombre', accessor: 'nombre' },
          { header: 'Descripción', accessor: 'descripcion' },
          { header: 'Stock Actual', accessor: 'stockActual' },
          { header: 'Unidad', accessor: 'unidadMedida' },
        ];
        data = reportData.rows;
        break;

      case 'Reporte de Movimientos de Inventario':
        specificAttributes = [
          { label: "Total Movimientos", value: reportData.total_cambios },
          { label: "Total Entradas", value: reportData.total_entradas_cantidad, badgeColor: "success" },
          { label: "Total Salidas", value: reportData.total_salidas_cantidad, badgeColor: "failure" },
        ];
        columns = [
          { header: 'Fecha', accessor: (row) => formatDate(row.fecha) },
          { header: 'Insumo', accessor: 'insumoNombre' },
          { header: 'Tipo', accessor: 'tipo' },
          { header: 'Cantidad', accessor: 'cantidad' },
          { header: 'Motivo', accessor: 'motivo' },
        ];
        data = reportData.rows;
        break;

      default:
        columns = [];
        data = [];
        specificAttributes = [];
    }

    return { columns, data, specificAttributes, commonAttributes };
  };

  // Función para exportar a PDF
  const handleDownloadPdf = () => {
    if (!reportData) return;

    const doc = new jsPDF({ orientation: 'landscape' });
    const { columns, data, specificAttributes, commonAttributes } = getReportConfiguration(reportData);

    // Título del reporte
    doc.setFontSize(16);
    doc.text(reportData.nombreReporte, 14, 20);
    
    // Información del reporte
    doc.setFontSize(9);
    let yPos = 30;

    [...commonAttributes, ...specificAttributes].forEach(attr => {
      let valStr = typeof attr.value === 'number' && 
                   (attr.label.toLowerCase().includes('recaudado') || 
                    attr.label.toLowerCase().includes('pendiente') || 
                    attr.label.toLowerCase().includes('valor total')) 
                   ? formatCurrency(attr.value) 
                   : String(attr.value);
      
      doc.text(`${attr.label}: ${valStr}`, 14, yPos);
      yPos += 5.5;
    });

    // Preparar datos para la tabla
    const head = [columns.map(col => col.header)];
    const body = data.map(row =>
      columns.map(colDef => {
        let cellValue;
        if (typeof colDef.accessor === 'function') {
          cellValue = colDef.accessor(row);
        } else {
          cellValue = row[colDef.accessor];
        }
        return String(cellValue === null || typeof cellValue === 'undefined' ? 'N/A' : cellValue);
      })
    );

    // Generar tabla
    autoTable(doc, {
      startY: yPos + 2,
      head: head,
      body: body,
      theme: 'grid',
      styles: { fontSize: 7, cellPadding: 1.5, overflow: 'linebreak' },
      headStyles: { fillColor: [220, 220, 220], textColor: [0,0,0], fontStyle: 'bold', halign: 'center' },
      didDrawPage: function (hookData) {
        doc.setFontSize(8);
        const pageCount = doc.internal.getNumberOfPages();
        doc.text('Página ' + hookData.pageNumber + ' de ' + pageCount, hookData.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    // Guardar archivo
    doc.save(`${reportData.nombreReporte.replace(/[\s/]+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Estado vacío
  if (!reportData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 p-6 shadow-lg rounded-xl text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
        <HiDocumentReport className="h-16 w-16 mb-4 text-gray-400" />
        <p className="text-xl font-semibold mb-2">No hay reporte seleccionado</p>
        <p className="text-center">Seleccione un tipo de reporte y los filtros necesarios, luego presione "Generar Reporte".</p>
      </div>
    );
  }

  const { columns, data, specificAttributes, commonAttributes } = getReportConfiguration(reportData);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header del reporte */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <HiDocumentReport className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {reportData.nombreReporte}
          </h3>
        </div>
        <Button
          onClick={handleDownloadPdf}
          className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
        >
          <HiDownload className="h-5 w-5 mr-2" />
          Descargar PDF
        </Button>
      </div>

      {/* Atributos del reporte */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {commonAttributes.map((attr, i) => (
          <div key={`common-${i}`} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{attr.label}</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{attr.value}</p>
          </div>
        ))}
        {specificAttributes.map((attr, i) => (
          <div key={`specific-${i}`} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{attr.label}</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {attr.badgeColor ? (
                <Badge color={attr.badgeColor} size="lg">
                  {attr.value}
                </Badge>
              ) : (
                attr.value
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Tabla de datos */}
      <div className="mt-8">
        {columns.length > 0 && data.length > 0 ? (
          <div className="overflow-x-auto">
            <Table hoverable>
              <TableHead>
                {columns.map((col, index) => (
                  <TableHeadCell key={index}>
                    {col.header}
                  </TableHeadCell>
                ))}
              </TableHead>
              <TableBody className="divide-y">
                {data.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    {columns.map((col, colIndex) => {
                      let cellValue;
                      if (typeof col.accessor === 'function') {
                        cellValue = col.accessor(row);
                      } else {
                        cellValue = row[col.accessor];
                      }
                      return (
                        <TableCell key={colIndex} className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {cellValue === null || typeof cellValue === 'undefined' ? 'N/A' : String(cellValue)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
            <HiExclamation className="h-12 w-12 mb-4 text-gray-400" />
            <p className="text-lg font-medium">No hay datos disponibles</p>
            <p className="text-sm">No se encontraron registros para los criterios seleccionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportViewer;
