Secretaria/Doctor	Backlog		Alta	Funcional	Reportes	AC1: El sistema debe permitir filtrar el reporte por un paciente específico o por un rango de fechas.
AC2: El reporte debe listar las citas mostrando fecha, hora, paciente, doctor y estado (atendida, cancelada, etc.).
AC3: El reporte debe poder exportarse a formato PDF.	Yo como usuario quiero generar un reporte de citas para consultar el historial de un paciente o la actividad de la clínica en un período determinado.
Doctor	Backlog		Alta	Funcional	Reportes	AC1: El reporte se debe generar para un único paciente, seleccionando por nombre + DUI.
AC2: Debe consolidar en una vista única: datos personales, antecedentes y expedientes clínicos.
AC3: El reporte debe poder exportarse a formato PDF.	Yo como usuario quiero generar un reporte del historial clínico completo de un paciente para tener una vista consolidada y exportable de toda su información médica.
Secretaria	Backlog		Media	Funcional	Reportes	AC1: El reporte debe mostrar un listado completo de todos los pacientes registrados y ser filtrable por fecha.
AC2: El listado debe incluir columnas para nombre, DUI, teléfono y fecha de registro.
AC3: El reporte debe poder exportarse a formato PDF.	Yo como usuario quiero generar un listado de todos los pacientes registrados para tener una referencia general de sus datos de contacto.
Secretaria	Backlog		Alta	Funcional	Reportes	AC1: El sistema debe permitir filtrar las facturas por un rango de fechas.
AC2: El reporte debe listar cada factura con su número, fecha, nombre del paciente y monto total.
AC3: El reporte debe poder exportarse a formato PDF.	Yo como usuario quiero generar un reporte de todas las facturas emitidas en un período para realizar el control financiero y los cierres contables.
Doctor	Backlog		Baja	Funcional	Reportes	AC1: Se debe poder filtrar las respuestas de las encuestas por rango de fechas.
AC2: El reporte debe mostrar las preguntas y las respuestas de forma consolidada.
AC3: El reporte debe poder exportarse a formato PDF."	Yo como usuario quiero consultar las respuestas de las encuestas de satisfacción para evaluar la calidad del servicio y la experiencia de mis pacientes.
Secretaria/Doctor	Backlog		Media	Funcional	Reportes	AC1: El reporte debe listar todos los insumos registrados en el sistema.
AC2: Para cada insumo, debe mostrar el nombre, la cantidad actual en stock y su unidad de medida.
AC3: El reporte debe poder exportarse a formato PDF."	Yo como secretaria o doctor quiero generar un reporte con las cantidades actuales de todos los insumos para conocer la disponibilidad de materiales en cualquier momento.
Secretaria	Backlog		Media	Funcional	Reportes	AC1: Debe permitir filtrar los movimientos por un rango de fechas y/o por un insumo específico.
AC2: El reporte debe listar cada movimiento con su fecha, tipo (entrada/salida), insumo, cantidad y usuario que lo registró.
AC3: El reporte debe poder exportarse a formato PDF."	Yo como secretaria quiero generar un reporte de movimientos de inventario para auditar las entradas y salidas de materiales en un período de tiempo.
Secretaria/Doctor	Backlog		Alta	Funcional	Citas	AC1:El sistema registra citas con su fecha, hora, asunto y el expediente correspondiente.
AC2:Se debe de validar que dos citas no puedan ser agendadas la misma hora y el mismo dia.	Yo como secretaria necesito agendar nuevas citas para cada paciente, la cita registrara: la fecha y hora en que se programa la cita, el expediente del paciente y el tratamiento y/o asunto que de la cita.
Secretaria/Doctor	Backlog		Alta	Funcional	Citas	AC1:El sistema permite modificar citas con su fecha, hora, asunto.
AC2:Se debe de validar que dos citas no puedan ser agendadas la misma hora y el mismo dia.
AC3:En caso de cambiar la fecha y/o hora el sistema la deja disponible para ser asignada a otra cita.
	Yo como usuario requiero de la capacidad para modificar una cita en caso de error o actualizacion.
Secretaria/Doctor	Backlog		Alta	Funcional	Citas	AC1:El sistema muestra todas las citas programadas para la fecha actual que se maneja en la computadora.
AC2:El sistema muestra  las citas junto con sus caracteristicas (fecha, hora,asunto y expediente).
AC3:Se puede aplicar un filtro para ver las citas de otra fecha organizado por semana o citas de un tratamiento/asunto especifico
	Yo como usuario necesito consultar las todas las citas que han sido programadas.
Secretaria/Doctor	Backlog		Alta	Funcional	Citas	AC1:El sistema cancela la cita y muestra la opcion para reagendar la cita.
AC2:El sistema muestra el registro con la cita que a sido cancelada.
AC3:El sistema libera la fecha y hora de la cita cancelada para que otra pueda ser agendada a reprogramada en ese fecha y hora
	Yo como usuario preciso de la capacidad para cancelar una cita en caso que alguna de las partes (paciente o doctor) no tengan disponibilidad.
Doctor	Backlog		Media	Funcional	Diagnóstico	AC1: Se deben validar los campos
AC2: Se debe registrar fecha y hora de emisión de la receta médica.
AC3: Se debe vincular al expediente del paciente.	Yo como doctor quiero poder registrar las recetas médicas, para que el paciente reciba correctamente sus medicamentos.
Doctor	Backlog		Media	Funcional	Diagnóstico	AC1: Archivos permitidos: JPG, PNG, PDF.
AC2: Se puede agregar un título y descripción.	Yo como doctor quiero subir radiografías o fotografías clínicas al expediente para complementar el diagnóstico visual del paciente.
Doctor	Backlog		Alta	Funcional	Diagnóstico	AC1: El odontograma aparece en la vista del expediente.
AC2: Se puede descargar en formato PDF	Yo como doctor quiero poder anexar el odontograma generado al expediente clínico del paciente para que quede documentado su estado dental.
Doctor	Backlog		Media	Funcional	Diagnóstico	AC1: Se puede registrar una ficha por consulta.
AC2: Las fichas anteriores no se eliminan.	Yo como doctor quiero registrar la ficha de ortodoncia para cada consulta del paciente, con los datos correspondientes al tratamiento y avances.
Doctor	Backlog		Alta	Funcional	Diagnóstico	AC1: El expediente se muestra organizado cronológicamente.
AC2: Se puede filtrar por tipo de tratamiento o fecha.	Yo como doctor quiero poder consultar el expediente clínico de un paciente para revisar su historial completo y brindar un tratamiento adecuado.
Doctor	Backlog		Alta	Funcional	Diagnóstico	AC1: El expediente se vincula al paciente y cita.
AC2: Puede ser actualizado en cada consulta.
AC3: Está disponible para consulta por usuarios autorizados.	Yo como doctor quiero crear un expediente clínico por paciente para documentar el tratamiento recibido y su evolución.
Doctor	Backlog		Media	Funcional	Diagnóstico	AC1: Sólo ciertos campos pueden editarse (contacto, dirección).
AC2: El cambio se registra en el historial del sistema.	Yo como doctor quiero editar la información de un paciente cuando detecto errores o actualizaciones, para mantener los registros precisos.
Secretaria/Doctor	Backlog		Alta	Funcional	Diagnóstico	AC1: El sistema permite búsqueda por nombre o DUI
AC2: Se muestra un listado filtrado.
AC3: Se puede acceder a su expediente desde el listado.	Yo como secretaria o doctor quiero poder buscar un paciente por nombre o número de identificación, para acceder rápidamente a su perfil clínico.
Doctor	Backlog		Alta	Funcional	Diagnóstico	AC1: El paciente aparece en el listado general.
AC2: Los campos obligatorios deben validarse.
AC3: El expediente clínico queda creado y vinculado.	Yo como doctor quiero registrar un nuevo paciente con sus datos personales y antecedentes médicos, para poder crear un expediente clínico completo desde su primera visita.
Secretaria	Backlog	Raúl Herrera	Alta	Funcional	Facturacion	AC1: La factura debe mostrar fecha, método de pago, estado.
AC2: Se debe calcular el total, aplicar descuentos si existen.
AC3: Debe existir capacidad para añadir cualquier cantidad de detalles con un botón para agregar o eliminar detalles de factura desde la misma ventana.	Yo como secretaria quiero generar una factura con el detalle de los servicios realizados, para entregarle un comprobante y registrar el cobro en el sistema.
Doctor	Backlog		Media	Funcional	Diagnóstico	AC1: El sistema no debe poder eliminar una receta médica que haya sido impresa. 
AC2: El sistema debe de registrar la eliminación de la receta médica.	Yo como usuario quiero poder eliminar recetas médicas, en caso de emitir alguna por error.
Doctor	Backlog		Media	Funcional	Diagnóstico	AC1: La receta puede editarse hasta que se imprime, después de imprimirse ya no se puede editar.
AC2: Los cambios debe ser reflejados en la receta médica antes creada.	Yo como usuario quiero poder editar recetas médicas en caso de errores en la misma, para que el paciente reciba correctamente sus medicamentos.
Secretaria	Backlog		Alta	Funcional	Citas	AC1: Si no se llena la encuesta, no se registrará ningún dato asociado a ella.
AC2: El sistema permite registrar una encuesta de satisfacción únicamente para pacientes que han asistido a una cita.
	Yo como secretaria quiero poder registrar una encuesta de satisfacción al cliente que ha asistido a la cita.
Secretaria	Backlog		Alta	Funcional	Citas	AC1: Se permite consultar el listado de encuestas registradas.
AC2:Se puede aplicar un filtro de fechas para el listado de encuestas.	Yo como usuario necesito la capacidad de ver un registro con todas las encuestas realizadas.
Secretaria	Backlog		Alta	Funcional	Citas	AC1: El sistema elimina la encuesta con todos sus datos asociados.
AC2:Se muestra el registro de encuestas actualizado.	Yo como usuario preciso de la capacidad para eliminar una encuesta en caso de error o solicitud del paciente 
Doctor	Backlog		Alta	Funcional	Diagnóstico	AC1: Se pueden identificar dientes con caries, extracciones, etc.
AC2: Se puede comparar entre versiones.	Yo como doctor quiero poder crear el odontograma del paciente, para registrar el estado de la dentadura.
Doctor	Backlog		Alta	Funcional	Diagnóstico	AC1: Cada actualización de un diente genera un registro con fecha y hora.
AC2: Consultar historial individual por diente.
AC3: La vista debe estar ordenada de manera cronológica.	Yo como doctor quiero poder  actualizar el odontograma del paciente, de forma que se registren cambios en cada cita sin perder versiones anteriores.