import React from 'react';
import { Button, Label, Select, TextInput } from 'flowbite-react';
import { HiCalendar, HiUser, HiDocumentReport } from 'react-icons/hi';

const ReportSelector = ({
  reportOptions,
  selectedReportType,
  onReportTypeChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  onGenerateReport,
  isLoading,
  pacientes,
  selectedPacienteId,
  onPacienteChange,
  showDateFilters,
  showPacienteFilter
}) => {
  // Determinar si el botón de generar debe estar deshabilitado
  const isGenerateButtonDisabled = 
    !selectedReportType || 
    isLoading ||
    (showPacienteFilter && !selectedPacienteId) ||
    (showDateFilters && (!fromDate || !toDate));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-xl mb-8 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-6">
        <HiDocumentReport className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Generar Reporte
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        
        {/* Selector de Tipo de Reporte */}
        <div className="md:col-span-1">
          <Label htmlFor="reportType" className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
            Tipo de Reporte
          </Label>
          <Select
            id="reportType"
            value={selectedReportType}
            onChange={(e) => onReportTypeChange(e.target.value)}
            className="w-full"
            disabled={isLoading}
          >
            <option value="" disabled>Seleccione un tipo</option>
            {reportOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Filtro de Paciente (condicional) */}
        {showPacienteFilter && (
          <div className="md:col-span-1">
            <Label htmlFor="pacienteFilter" className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
              <HiUser className="inline h-4 w-4 mr-1" />
              Paciente
            </Label>
            <Select
              id="pacienteFilter"
              value={selectedPacienteId}
              onChange={(e) => onPacienteChange(e.target.value)}
              className="w-full"
              disabled={!selectedReportType || isLoading}
            >
              <option value="" disabled>Seleccione un paciente</option>
              {pacientes.map((paciente) => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.nombre}
                </option>
              ))}
            </Select>
          </div>
        )}
        
        {/* Filtros de Fecha (condicionales) */}
        {showDateFilters && (
          <>
            <div className="md:col-span-1">
              <Label htmlFor="fromDate" className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                <HiCalendar className="inline h-4 w-4 mr-1" />
                Desde
              </Label>
              <TextInput
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={(e) => onFromDateChange(e.target.value)}
                className="w-full"
                disabled={!selectedReportType || isLoading}
              />
            </div>
            <div className="md:col-span-1">
              <Label htmlFor="toDate" className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                <HiCalendar className="inline h-4 w-4 mr-1" />
                Hasta
              </Label>
              <TextInput
                type="date"
                id="toDate"
                value={toDate}
                onChange={(e) => onToDateChange(e.target.value)}
                className="w-full"
                disabled={!selectedReportType || isLoading}
              />
            </div>
          </>
        )}

        {/* Botón de Generar */}
        <div className="md:col-span-1">
          <Button
            onClick={onGenerateReport}
            disabled={isGenerateButtonDisabled}
            className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            isProcessing={isLoading}
            processingSpinner={
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            }
          >
            {isLoading ? 'Generando...' : 'Generar Reporte'}
          </Button>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Nota:</strong> Los reportes se generan en tiempo real con los datos actuales del sistema. 
          {showDateFilters && ' Seleccione un rango de fechas para filtrar los resultados.'}
          {showPacienteFilter && ' Para el historial clínico, debe seleccionar un paciente específico.'}
        </p>
      </div>
    </div>
  );
};

export default ReportSelector;
