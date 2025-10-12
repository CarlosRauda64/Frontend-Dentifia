	

**Índice**

[I.	Product Backlog	1](#product-backlog)

[II.	Sprint Planning	3](#sprint-planning)

[Objetivo del Sprint	3](#objetivo-del-sprint)

[Cálculo de la duración del Sprint	3](#cálculo-de-la-duración-del-sprint)

[Pila del Sprint	4](#pila-del-sprint)

[III.	Planilla de Scrum Diario	24](#planilla-de-scrum-diario)

[IV.	Sprint Review	29](#sprint-review)

[Carta de Aceptación del usuario	29](#carta-de-aceptación-del-usuario)

[Análisis y diseño del incremento:	30](#análisis-y-diseño-del-incremento:)

[Casos de Uso	30](#casos-de-uso)

[V.	Inventario	38](#inventario)

[Gestionar Inventario	39](#gestionar-inventario)

[Gestionar Insumo	39](#gestionar-insumo)

[Consulta de listado de insumos	40](#consulta-de-listado-de-insumos)

[Desactivación de insumo	41](#desactivación-de-insumo)

[Edición de insumo	41](#edición-de-insumo)

[Consulta de listado de movimientos de inventario	43](#consulta-de-listado-de-movimientos-de-inventario)

[Edición de movimiento en inventario	43](#edición-de-movimiento-en-inventario)

[Registro de movimiento en inventario	44](#registro-de-movimiento-en-inventario)

[Cancelar movimiento en inventario	45](#cancelar-movimiento-en-inventario)

[BPMN de los procesos realizados	46](#bpmn-de-los-procesos-realizados)

[Diseño de interfaces de entrada, procesos y salidas.	53](#diseño-de-interfaces-de-entrada,-procesos-y-salidas.)

[Diseño de base de datos	73](#diseño-de-base-de-datos)

[VI.	Sprint Retrospective.	79](#sprint-retrospective.)

[VII.	Video de funcionalidades entregadas.	80](#video-de-funcionalidades-entregadas.)

[VIII.	Enlace para comprobación de código.	80](#enlace-para-comprobación-de-código.)

[IX.	Sitio de prueba de la aplicación	80](#sitio-de-prueba-de-la-aplicación)

1. # **Product Backlog** {#product-backlog}

| Código | Nombre | Asignación | Sprint | Prioridad del Negocio | Estado |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **HU-01** | Inicio de Sesion | Carlos Daniel Rauda Contreras | Sprint 1 | Alta | Backlog |
| **HU-02** | Creación de usuarios | Carlos Daniel Rauda Contreras | Sprint 1 | Alta | Backlog |
| **HU-03** | Eliminación de usuario | Carlos Daniel Rauda Contreras | Sprint 1 | Alta | Backlog |
| **HU-04** | Edición de usuarios | Carlos Daniel Rauda Contreras | Sprint 1 | Media | Backlog |
| **HU-05** | Listado de Usuarios | Carlos Daniel Rauda Contreras | Sprint 1 | Media | Backlog |
| **HU-06** | Editar Perfil | Carlos Daniel Rauda Contreras | Sprint 1 | Media | Backlog |
| **HU-07** | Registro de nuevo insumo | Rodrigo Garciaguirre | Sprint 1 | Alta | Backlog |
| **HU-08** | Consulta de listado de insumos | Rodrigo Garciaguirre | Sprint 1 | Alta | Backlog |
| **HU-09** | Edición de datos de insumo | Rodrigo Garciaguirre | Sprint 1 | Media | Backlog |
| **HU-10** | Desactivación de insumo | Rodrigo Garciaguirre | Sprint 1 | Baja | Backlog |
| **HU-11** | Registro de movimiento en inventario | Oscar David Cruz Iraheta | Sprint 1 | Alta | Backlog |
| **HU-12** | Edicion de movimiento en inventario | Oscar David Cruz Iraheta | Sprint 1 | Media | Backlog |
| **HU-13** | Consulta de listado de movimientos | Oscar David Cruz Iraheta | Sprint 1 | Alta | Backlog |
| **HU-14** | Cancelar movimiento en inventario | Oscar David Cruz Iraheta | Sprint 1 | Alta | Backlog |
| **HU-15** | Cancelar Factura Emitida | Raúl Herrera | Sprint 1 | Alta | Backlog |
| **HU-16** | Ver Historial de Facturas | Raúl Herrera | Sprint 1 | Alta | Backlog |
| **HU-17** | Editar Factura | Raúl Herrera | Sprint 1 | Alta | Backlog |
| **HU-18** | Crear Factura | Raúl Herrera | Sprint 1 | Alta | Backlog |
| **HU-19** | Registro de Paciente Nuevo |  | Sprint 2 | Alta | Backlog |
| **HU-20** | Consultas de pacientes registrados |  | Sprint 2 | Alta | Backlog |
| **HU-21** | Edición de datos personales del paciente |  | Sprint 2 | Media | Backlog |
| **HU-22** | Creación de expediente clínico |  | Sprint 2 | Alta | Backlog |
| **HU-23** | Consulta del expediente clínico |  | Sprint 2 | Alta | Backlog |
| **HU-24** | Registro de ficha de ortodoncia |  | Sprint 2 | Media | Backlog |
| **HU-25** | Registro y versión de odontograma |  | Sprint 2 | Alta | Backlog |
| **HU-26** | Anexar odontograma al expediente |  | Sprint 2 | Alta | Backlog |
| **HU-27** | Subir anexos clínicos |  | Sprint 2 | Media | Backlog |
| **HU-28** | Registro y edición de recetas médicas |  | Sprint 2 | Media | Backlog |
| **HU-29** | Gestión de Citas |  | Sprint 2 | Alta | Backlog |
| **HU-30** | Reporte de Movimientos de Inventario |  | Sprint 2 | Media | Backlog |
| **HU-31** | Reporte de Stock de Insumos |  | Sprint 2 | Media | Backlog |
| **HU-32** | Reporte de Encuestas de Satisfacción |  | Sprint 2 | Baja | Backlog |
| **HU-33** | Reporte de Facturación |  | Sprint 2 | Alta | Backlog |
| **HU-34** | Reporte de Pacientes |  | Sprint 2 | Media | Backlog |
| **HU-35** | Reporte de Historial Clínico |  | Sprint 2 | Alta | Backlog |
| **HU-36** | Reporte de Citas |  | Sprint 2 | Alta | Backlog |
| **HU-01-NF** | Configuración del Proyecto Base | Carlos Daniel Rauda Contreras | Sprint 1  | Sprint 1  | Backlog  |
| **HU-02-NF** | Autenticación con JWT | Carlos Daniel Rauda Contreras | Sprint 1 | Alta | Backlog |

2. # **Sprint Planning** {#sprint-planning}

## **Objetivo del Sprint** {#objetivo-del-sprint}

En este primer sprint se busca implementar las funciones básicas necesarias para comenzar a utilizar el sistema DentiFIA. Esto incluye permitir que los usuarios puedan iniciar sesión de forma segura, registrar nuevos usuarios y gestionar sus perfiles. También se desarrollará la parte inicial para llevar control de los insumos de la clínica, permitiendo agregar entradas o salidas del inventario, y la emisión de facturas por los servicios prestados. Con esto, se espera que el sistema comience a operar en sus funciones más esenciales.

## **Cálculo de la duración del Sprint** {#cálculo-de-la-duración-del-sprint}

Se utilizo el puntaje de la secuencia de **Fibonacci.** 

| Puntaje usado |  |
| :---: | :---: |
| **Puntos** | Horas |
| **1** | 4 |
| **2** | 8 |
| **3** | 12 |
| **5** | 20 |
| **8** | 32 |
| **13** | 52 |

| Estimación de disponibilidad del equipo |  |  |  |
| ----- | :---: | :---: | :---: |
| **Integrantes del equipo** | Horas x Dia | Horas x Semana | Primer Sprint  2 semanas y media |
| **Carlos Daniel Rauda Contreras** | 4 | 20 |  |
| **Rodrigo Ernesto Parada Garciaguirre** | 4 | 20 |  |
| **Raúl Enrique Herrera Bernal** | 4 | 20 |  |
| **Oscar David Cruz Iraheta** | 4 | 20 |  |
| **Total** | 16 | 80 | 200 |

| Parámetros |  |
| :---: | :---: |
| **Horas de trabajo** | 4h |
| **Dias de la semana trabajadas** | 5d |
| **Primer Sprint Duración** | 2 semanas y media |

## **Pila del Sprint** {#pila-del-sprint}

| Código | Name | Asignación | Sprint | Prioridad del Negocio | Estado | Puntuación |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **HU-01** | Inicio de Sesion | Carlos Daniel Rauda Contreras | Sprint 1 | Alta | Backlog | 2 |
| **HU-02** | Creación de usuarios | Carlos Daniel Rauda Contreras | Sprint 1 | Alta | Backlog | 3 |
| **HU-03** | Eliminación de usuario | Carlos Daniel Rauda Contreras | Sprint 1 | Alta | Backlog | 2 |
| **HU-04** | Edición de usuarios | Carlos Daniel Rauda Contreras | Sprint 1 | Media | Backlog | 3 |
| **HU-05** | Listado de Usuarios | Carlos Daniel Rauda Contreras | Sprint 1 | Media | Backlog | 2 |
| **HU-06** | Editar Perfil | Carlos Daniel Rauda Contreras | Sprint 1 | Media | Backlog | 2 |
| **HU-07** | Registro de nuevo insumo | Rodrigo Garciaguirre | Sprint 1 | Alta | Backlog | 3 |
| **HU-08** | Consulta de listado de insumos | Rodrigo Garciaguirre | Sprint 1 | Alta | Backlog | 2 |
| **HU-09** | Edición de datos de insumo | Rodrigo Garciaguirre | Sprint 1 | Media | Backlog | 2 |
| **HU-10** | Desactivación de insumo | Rodrigo Garciaguirre | Sprint 1 | Baja | Backlog | 1 |
| **HU-11** | Registro de movimiento en inventario | Oscar David Cruz Iraheta | Sprint 1 | Alta | Backlog | 3 |
| **HU-12** | Edicion de movimiento en inventario | Oscar David Cruz Iraheta | Sprint 1 | Media | Backlog | 2 |
| **HU-13** | Consulta de listado de movimientos | Oscar David Cruz Iraheta | Sprint 1 | Alta | Backlog | 2 |
| **HU-14** | Cancelar movimiento en inventario | Oscar David Cruz Iraheta | Sprint 1 | Alta | Backlog | 2 |
| **HU-15** | Cancelar Factura Emitida | Raúl Herrera | Sprint 1 | Alta | Backlog | 3 |
| **HU-16** | Ver Historial de Facturas | Raúl Herrera | Sprint 1 | Alta | Backlog | 2 |
| **HU-17** | Editar Factura | Raúl Herrera | Sprint 1 | Alta | Backlog | 3 |
| **HU-18** | Crear Factura | Raúl Herrera | Sprint 1 | Alta | Backlog | 3 |
| **HU-01-NF** | Configuración del Proyecto Base | Carlos Daniel Rauda Contreras | Sprint 1 | Alta | Backlog | 2 |
| **HU-02-NF** | Autenticación con JWT | Carlos Daniel Rauda Contreras | Sprint 1 | Alta | Backlog | 2 |
| **Total Puntos** |  |  |  |  |  | 46 |
| **Total Horas** |  |  |  |  |  | 184 |

**Historias de Usuario Completas**

 

**![][image1]**

![][image2]

**![][image3]**

![][image4]![][image5]![][image6]![][image7]

\*![][image8]![][image9]![][image10]![][image11]

![][image12]

![][image13]

![][image14]![][image15]![][image16]![][image17]![][image18]

3. # **Planilla de Scrum Diario** {#planilla-de-scrum-diario}

![][image19]

| Fecha de la reunión |  | 06/Junio/2025 |  |
| :---: | :---: | :---: | :---: |
| **Integrantes** | ¿Qué hice ayer? | ¿Qué tengo que hacer hoy? | ¿Qué impedimento tengo para realizar las actividades? |
| **Carlos Daniel Rauda Contreras** | Comenzar las historias de usuario | Terminar las historias de usuario del módulo seguridad | Entregas de actividades en la Universidad |
| **Raúl Enrique Herrera Bernal** | Analizar los requerimientos del sistema | Realizar las historias de usuario del módulo de factura | Entregas de actividades en la Universidad |
| **Oscar David Cruz Iraheta** | Comenzar las historias de usuario | Terminar las historias de usuario del módulo inventario | Entregas de actividades en la Universidad |
| **Rodrigo Ernesto Parada Garciaguirre** | Comenzar las historias de usuario | Terminar las historias de usuario del módulo inventario | Entregas de actividades en la Universidad |

![][image20]

| Fecha de la reunión |  | 08/Junio/2025 |  |
| :---: | :---: | :---: | :---: |
| **Integrantes** | ¿Qué hice ayer? | ¿Qué tengo que hacer hoy? | ¿Qué impedimento tengo para realizar las actividades? |
| **Carlos Daniel Rauda Contreras** | Comenzar a estructura del Backend y Frontend | Terminar la estructura del backend |  |
| **Raúl Enrique Herrera Bernal** | Realizando historias de usuario para modulo factura | Terminar las historias de usuario del modulo factura |  |
| **Oscar David Cruz Iraheta** | Terminar historias de usuario modulo inventario y citas | Comenzar con los casos de uso para inventario |  |
| **Rodrigo Ernesto Parada Garciaguirre** | Terminar historias de usuario modulo inventario y reportes | Comenzar con los casos de uso para inventario |  |

![][image21]

| Fecha de la reunión |  | 13/Junio/2025 |  |
| :---: | :---: | :---: | :---: |
| **Integrantes** | ¿Qué hice ayer? | ¿Qué tengo que hacer hoy? | ¿Qué impedimento tengo para realizar las actividades? |
| **Carlos Daniel Rauda Contreras** | Terminando los casos de uso y pantallas del módulo seguridad  | Comenzar con la programación del módulo seguridad | Exámenes parciales de la Universidad |
| **Raúl Enrique Herrera Bernal** | Terminando las historias de usuario para factura y comenzando a realizar casos de uso | Terminar los casos de usos del módulo de factura | Exámenes parciales de la Universidad |
| **Oscar David Cruz Iraheta** | Terminar los casos de uso del modulo de inventario | Comenzar con el modelado de pantallas | Exámenes parciales de la Universidad |
| **Rodrigo Ernesto Parada Garciaguirre** | Realizando los casos de uso del modulo de inventario | Terminar los casos de uso del modulo de inventario | Exámenes parciales de la Universidad |

![][image22]

| Fecha de la reunión |  | 15/Junio/2025 |  |
| :---: | :---: | :---: | :---: |
| **Integrantes** | ¿Qué hice ayer? | ¿Qué tengo que hacer hoy? | ¿Qué impedimento tengo para realizar las actividades? |
| **Carlos Daniel Rauda Contreras** | Terminando el modulo de seguridad en el sistema | Finalizar el modulo de seguridad | Exámenes parciales de la Universidad. |
| **Raúl Enrique Herrera Bernal** | Realizando las pantallas del módulo de factura | Terminar las pantallas y revisar la estructura del proyecto | Exámenes parciales de la Universidad. |
| **Oscar David Cruz Iraheta** | Comenzar a revisar la estructura del proyecto | Comenzar con el diseño del modulo de inventario en el sistema | Exámenes parciales de la Universidad. |
| **Rodrigo Ernesto Parada Garciaguirre** | Revisando los casos de uso y pantallas hechas | Comenzar a revisar la estructura del proyecto | Exámenes parciales de la Universidad. |

![][image23]

| Fecha de la reunión |  | 15/Junio/2025 |  |
| :---: | :---: | :---: | :---: |
| **Integrantes** | ¿Qué hice ayer? | ¿Qué tengo que hacer hoy? | ¿Qué impedimento tengo para realizar las actividades? |
| **Carlos Daniel Rauda Contreras** | Revisando aspectos de los requerimientos del sistema | Revisar los avances en el sistema | Exámenes parciales de la Universidad |
| **Raúl Enrique Herrera Bernal** | n/a | n/a | n/a |
| **Oscar David Cruz Iraheta** | Comenzar a programar el modulo de inventario en el sistema | Finalizar el modulo de inventario en el sistema | Exámenes parciales de la Universidad |
| **Rodrigo Ernesto Parada Garciaguirre** | Comenzar a programar el módulo de inventario en el sistema | Finalizar el módulo de inventario en el sistema | Exámenes parciales de la Universidad |

4. # **Sprint Review** {#sprint-review}

## **Carta de Aceptación del usuario** {#carta-de-aceptación-del-usuario}

En el drive encontrar el documento de la carta de aceptación:

[https://drive.google.com/file/d/1pEVTb4AfBT6884we2Lf\_mFAg5UqeQ9Tc/view?usp=sharing](https://drive.google.com/file/d/1pEVTb4AfBT6884we2Lf_mFAg5UqeQ9Tc/view?usp=sharing)

## **Análisis y diseño del incremento:** {#análisis-y-diseño-del-incremento:}

### ***Casos de Uso*** {#casos-de-uso}

* Diagrama de Caso de Uso de Contexto

| Nombre | Iniciar Sesión | Código | CU-01 |
| :---- | :---- | :---- | :---- |
| **Actores** | Usuario del sistema | **Historia Usuario que cumple** | HU-01 |
| **Pre-condición** | El usuario debe estar registrado en el sistema y contar con sus credenciales válidas. |  |  |
| **Post-condición** | El sistema permite el acceso a las funcionalidades dentro del sistema según el rol |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. El usuario ingresa sus credenciales, que son el “usuario y contraseña” |  |  |  |
| 2\. El sistema valida los datos ingresados |  | 2a. Si las credenciales son inválidas se regresa al paso 1\. |  |
| 3\. Si son correctos el sistema identifica su rol asignado y muestra su respectivo panel. |  |  |  |
| 4\. El usuario accede al sistema con su sesión activa. |  |  |  |

| Nombre | Editar Perfil | Código | CU-02 |
| :---- | :---- | :---- | :---- |
| **Actores** | Administrador | **Historia de usuario que cumple** | HU-06 |
| **Pre-condición** | El usuario debe haber iniciado sesión exitosamente. |  |  |
| **Post-condición** | Los datos personales y/o contraseña han sido modificados. |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. El usuario accede desde su perfil en el sistema. |  |  |  |
| 2\. El sistema muestra su información. |  |  |  |
| 3\. El usuario decide editar su información. |  | 3a. El usuario decide no modificar su información regresando a la pantalla anterior. |  |
| 4\. El sistema muestra su información editable (excepto el rol). |  |  |  |
| 5\. El usuario modifica datos personales y/o contraseña. |  |  |  |
| 4\. El sistema valida los campos y guarda cambios. |  | 4a. Si hay errores de validación, el sistema muestra un mensaje de error. |  |
| 5\. Muestra los datos modificados en el perfil del usuario. |  |  |  |

* Modulo de Seguridad

| Nombre | Gestión de Usuarios | Código | CU-MS-01 |
| :---- | :---- | :---- | :---- |
| **Actores** | Administrador | **Historia Usuario que cumple** | HU-02, HU-03, HU-04, HU-05 |
| **Pre-condición** | El actor tuvo que haber iniciado sesión previamente. |  |  |
| **Post-condición** | Acceder al caso de uso solicitado por el usuario. |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. El administrador accede al módulo “Gestión de Usuarios”. |  |  |  |
| 2\. Visualiza el listado de usuarios registrados. |  | 2a. Si no tiene permisos, se bloquea el acceso. |  |
| 3\. Selecciona la acción que desea realizar. |  |  |  |

| Nombre | Crear Usuario | Código | CU-MS-02 |
| :---- | :---- | :---- | :---- |
| **Actores** | Administrador | **Historia de usuario que cumple** | HU-01 |
| **Pre-condición** | El actor debe estar autenticado y tener permisos de administración. |  |  |
| **Post-condición** | El nuevo usuario queda registrado y visible en el listado. |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. Desde “Listado de Usuarios”, selecciona “Crear Usuario”. |  |  |  |
| 2\. Ingresa usuario, contraseña, correo, nombre, apellido y rol |  |  |  |
| 3\. El sistema valida campos. |  | 3a. Campos incompletos o incompletos: el sistema alerta y no permite guardar. |  |
| 4\. Guarda el usuario y redirige al listado. |  |  |  |

| Nombre | Eliminar Usuario | Código | CU-MS-03 |
| :---- | :---- | :---- | :---- |
| **Actores** | Administrador | **Historia de usuario que cumple** | HU-02 |
| **Pre-condición** | Usuario autenticado y con rol de administrador. |  |  |
| **Post-condición** | El usuario eliminado ya no podrá iniciar sesión ni aparecer en el listado. |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. Desde el listado, el administrador selecciona un usuario. |  |  |  |
| 2\. Hace clic en el icono de un **basurero** para eliminar |  |  |  |
| 3\. Muestra un mensaje para confirmar la acción. |  | 3a. Si cancela la acción, no se elimina. |  |
| 4\. El sistema elimina el registro. |  | 4a. Si ocurre un error técnico, el sistema notifica. |  |

| Nombre | Editar Usuario | Código | CU-MS-04 |
| :---- | :---- | :---- | :---- |
| **Actores** | Administrador | **Historia de usuario que cumple** | HU-03 |
| **Pre-condición** | Usuario autenticado y con rol de administrador. |  |  |
| **Post-condición** | La información del usuario es actualizada en el sistema. |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. El administrador selecciona un usuario del listado. |  |  |  |
| 2\. Modifica la información del usuario. |  | 2a. Si hay errores de validación, no se permite guardar. |  |
| 3\. Guarda los cambios. |  |  |  |
| 4\. El sistema confirma la edición. |  |  |  |

| Nombre | Listar Usuarios | Código | CU-MS-05 |
| :---- | :---- | :---- | :---- |
| **Actores** | Administrador | **Historia de usuario que cumple** | HU-04 |
| **Pre-condición** | Usuario autenticado y con rol de administrador. |  |  |
| **Post-condición** | Se muestra la lista de usuarios con opciones de acción. |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. Accede al módulo “Gestión de Usuarios”. |  |  |  |
| 2\. El sistema muestra la tabla de usuarios con nombre, correo, rol y acciones disponibles. |  | 2a. Si no hay usuarios, el sistema muestra “Sin resultados”. |  |

* Modulo de Factura

![][image24]

| Nombre | Gestionar Factura | Código | CU-Fac-01 |
| :---- | :---- | :---- | :---- |
| **Actores** | Secretaria | **Historia Usuario que cumple** | HU-15, HU-16, HU-17, HU-18 |
| **Pre-condición** | La secretaria tuvo que haber iniciado sesión previamente. |  |  |
| **Post-condición** | Acceder a una de las funciones de facturacion |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. La secretaria accede al modulo  “Gestionar Factura”. |  |  |  |
| 2\. Ve el menú con opciones disponibles dentro de el: Crear, editar, etc. |  |  |  |
| 3\. Selecciona la acción que se desa ejecutar. |  | 3a. Si no tiene permisos, se bloquea la accion con un mensaje de error. |  |
| 4.El sistema se redirige al caso de uso correspondiente |  |  |  |

| Nombre | Crear Factura | Código | CU-Fac-02 |
| :---- | :---- | :---- | :---- |
| **Actores** | Secretaria | **Historia Usuario que cumple** | HU-18Gra |
| **Pre-condición** | El paciente debe tener servicios registrados. |  |  |
| **Post-condición** | Se genera una factura y se registra en un Historial. |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. La secretaria accede al modulo de crear Factura. |  |  |  |
| 2\. La secretaria llena los campos. |  | 2a. Campos inválidos. Si se ingresan valores inválidos, aparece un error y no permite guardar. |  |
| 3\. Se añaden detalles de factura. |  |  |  |
| 4.El sistema calcula el total. |  |  |  |
| 5\. La secretaria confirma y guarda la factura  |  | 5a. No se llenaron detalles de factura. El sistema requiere de detalles de factura para crear una factura, si no se llena, se regresa al paso 3 mostrando un error. |  |
| 6\. La factura se registra y se va al hsitorial |  |  |  |

| Nombre | Editar Factura | Código | CU-Fac-03 |
| :---- | :---- | :---- | :---- |
| **Actores** | Secretaria | **Historia Usuario que cumple** | HU-17 |
| **Pre-condición** | El paciente debe tener servicios registrados. |  |  |
| **Post-condición** | Se genera una factura y se registra en un Historial. |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. La secretaria selecciona la factura a editar. |  |  |  |
| 2\. Modifica los datos o servicios  |  |  |  |
| 3\. El sistema recalcula automaticamente el total. |  |  |  |
| 4\. Guarda los cambios. |  |  |  |
| **Nombre** | Cancelar Factura Emitida | **Código** | CU-Fac-04 |
| **Actores** | Secretaria | **Historia Usuario que cumple** | HU-15 |
| **Pre-condición** | La factura debe estar emitida. |  |  |
| **Post-condición** | La factura queda registrada como "Cancelada". |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. La secretaria Accede al caso de uso |  |  |  |
| 2\. Selecciona la factura a cancelar |  | 2a. Si no tiene permisos, se muestra un mensaje de error. |  |
| 3\. El sistema solicita confirmacion y motivo de cancelacion. |  |  |  |
| 4\. La secretaria confirma. |  |  |  |
| 5\. Se actualiza el estado a “Cancelada” y se guarda en el historial  |  |  |  |

| Nombre | Historial de Factura | Código | CU – Fac05 |
| :---- | :---- | :---- | :---- |
| **Actores** | Secretaria | **Historia Usuario que cumple** | HU-16 |
| **Pre-condición** | La Secretaria a iniciado sesión. |  |  |
| **Post-condición** | Se visualiza el historial filtrado  |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. La secretaria accede a “Histortial de Facturas” |  | 1a. Si no hay facturas registradas, se muestra un mensaje “Sin resultados” |  |
| 2\. Consulta detalles de cada factura |  |  |  |

5. # Inventario {#inventario}

![][image25]

## Gestionar Inventario {#gestionar-inventario}

| Nombre | Gestionar Inventario | Codigo | CU-MI-09 |
| ----- | ----- | ----- | ----- |
| **Actores** | Secretaria, Doctor | **Historia Usuario** |  |
| **Pre-condición** | El actor ha iniciado sesión en el sistema y tiene los permisos necesarios para acceder al módulo de Inventario. |  |  |
| **Post-condición** | El sistema muestra el menú principal del módulo de Inventario. |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. El actor selecciona la opción "Inventario" en el menú principal. |  |   |  |
| 2\. El sistema presenta la pantalla del módulo de Inventario con las opciones "Gestión de Insumos" y "Gestión del Stock". |  |   |  |

## Gestionar Insumo {#gestionar-insumo}

| Nombre | Gestionar Insumo | Codigo | CU-MI-10 |
| ----- | ----- | ----- | ----- |
| **Actores** | Secretaria, Doctor | **Historia Usuario** | HU-07, HU-08, HU-09, HU-10 |
| **Pre-condición** | El actor ha iniciado sesión en el sistema, tiene los permisos necesarios y ha accedido al menú del módulo de Inventario. |  |  |
| **Post-condición** | El sistema muestra la pantalla de Gestión de Insumos, permitiendo realizar acciones sobre los insumos.,  |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. El actor selecciona la opción "Gestión de Insumos" en el menú de Inventario. |  |   |  |
| 2\. El sistema presenta la pantalla de Gestión de Insumos, mostrando un listado de insumos (CU-MI-01) y opciones para agregar (CU-MI-04), editar (CU-MI-03) o eliminar/desactivar insumos (CU-MI-02). |  |   |  |

Gestionar Movimiento Stock

| Nombre | Gestionar Movimiento Stock | Codigo | CU-MI-11 |
| ----- | ----- | ----- | ----- |
| **Actores** | Secretaria, Doctor | **Historia Usuario** | HU-11, HU-12, HU-13, HU-14 |
| **Pre-condición** | El actor ha iniciado sesión en el sistema y tiene los permisos necesarios. |  |  |
| **Post-condición** | El sistema muestra la pantalla de Gestión de Movimientos de Stock, permitiendo realizar acciones sobre los movimientos. |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. El actor selecciona la opción "Gestión del Stock" en el menú de Inventario. |  |   |  |
| 2\. El sistema presenta la pantalla de Registro de Movimientos en el Stock, mostrando un listado de movimientos (CU-MI-05) y opciones para registrar (CU-MI-07), editar (CU-MI-06) o cancelar movimientos (CU-MI-08). |  |   |  |

## Consulta de listado de insumos {#consulta-de-listado-de-insumos}

| Nombre | Listar de insumos | Codigo | CU-MI-01 |
| ----- | ----- | ----- | ----- |
| **Actores** | Secretaria, Doctor | **Historia Usuario** | HU-08 |
| **Pre-condición** | El actor ha iniciado sesión en el sistema y tiene los permisos necesarios. |  |  |
| **Post-condición** | El actor puede visualizar el listado de insumos con su stock actual. |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. El actor selecciona la opción "Inventario" en el sistema. |  |   |  |
| 2\. El sistema presenta la pantalla del Módulo Inventario. |  |   |  |
| 3\. El sistema muestra un listado de todos los insumos con su nombre, descripción y stock actual. |  |  |  |
| 4\. El actor visualiza la información necesaria. |  |   |  |
| 5\. El actor sale del listado de insumos. |  |   |  |
| 6\. El caso de uso termina. |  |  |  |

## Desactivación de insumo {#desactivación-de-insumo}

| Nombre | Desactivar insumo | Codigo | CU-MI-02 |
| ----- | ----- | ----- | ----- |
| **Actores** | Secretaria, Doctor | **Historia Usuario**  | HU-10 |
| **Pre-condición** | El actor ha iniciado sesión en el sistema y tiene los permisos necesarios. El insumo a desactivar existe en el sistema. |  |  |
| **Post-condición** | El insumo seleccionado está marcado como inactivo/descontinuado y no aparece en listados para operaciones diarias, pero su historial se conserva. |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. El actor accede a la gestión de insumos. |  |   |  |
| 2\. El sistema muestra el listado de insumos. |  |   |  |
| 3\. El actor selecciona el insumo que desea desactivar. |  |  |  |
| 4\. El actor selecciona la opción "Eliminar". |  |   |  |
| 5\. El sistema solicita confirmación para la desactivación. |  |   |  |
| 6\. El actor confirma la acción. |  | 6a. El actor cancela la acción. Si el actor cancela la acción, el sistema no realiza la desactivación y regresa al paso 2\. |  |
| 7\. El sistema marca el insumo como inactivo/descontinuado. |  |   |  |
| 8\. El sistema ya no mostrará el insumo desactivado en el listado de insumos. |  |   |  |
| 9\. El caso de uso termina. |  |  |  |

## Edición de insumo {#edición-de-insumo}

| Nombre | Editar insumo | Codigo | CU-MI-03 |
| ----- | ----- | ----- | ----- |
| **Actores** | Secretaria/Doctor | **Historia Usuario**  | HU-09 |
| **Pre-condición** | El actor ha iniciado sesión en el sistema y tiene los permisos necesarios. El insumo a editar existe en el sistema. |  |  |
| **Post-condición** | La información del insumo (nombre y/o descripción) ha sido actualizada y reflejada en el listado. |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. El Actor accede a la gestión de insumos. |  |   |  |
| 2\. El sistema muestra el listado de insumos. |  |   |  |
| 3\. El Actor selecciona el insumo que desea editar. |  |  |  |
| 4\. El Actor selecciona la opción "Editar". |  |   |  |
| 5\. El sistema presenta el formulario de edición con los datos actuales del insumo. |  |   |  |
| 6\. El Actor modifica el nombre y/o la descripción del insumo. |  |  |  |
| 7\. El Actor guarda los cambios. |  |   |  |
| 8\. El sistema valida la entrada de los nuevos valores y actualiza los datos del insumo. |  | 8a. Validación de datos fallida. Si los datos ingresados no son válidos, el sistema muestra un mensaje de error indicando qué campos requieren corrección y regresa al paso 5\. |  |
| 9\. El sistema confirma la actualización del insumo al actor redirigiéndole a la lista de insumos. |  |  |  |

Registro de nuevo insumo

| Nombre | Registrar insumo | Codigo | CU-MI-04 |
| ----- | ----- | ----- | ----- |
| **Actores** | Secretaria/Doctor | **Historia Usuario**  | HU-07 |
| **Pre-condición** | El Actor ha iniciado sesión y tiene permisos para registrar insumos. |  |  |
| **Post-condición** | Se ha registrado un nuevo insumo en el sistema con stock inicial cero.  |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. El Actor selecciona la opción para registrar un nuevo insumo. |  |   |  |
| 2\. El sistema presenta un formulario para el registro del insumo. |  |   |  |
| 3\. El Actor ingresa el nombre y la descripción del insumo (AC1). |  | 3a. Campos obligatorios vacíos. El sistema muestra un mensaje de error indicando los campos faltantes y regresa al paso 2\. |  |
| 4\. El Actor guarda el registro. |  |   |  |
| 5\. El sistema registra el nuevo insumo con un stock inicial de 0\. |  |   |  |
| 6\. El sistema redirige al listado de insumos. |  |   |  |
| 8\. El sistema muestra el nuevo insumo en el listado general de insumos |  |   |  |
| 9\. El caso de uso termina. |  |  |  |

## Consulta de listado de movimientos de inventario {#consulta-de-listado-de-movimientos-de-inventario}

| Nombre | Lista de movimientos en inventario | Codigo | CU-MI-05 |
| ----- | ----- | ----- | ----- |
| **Actores** | Secretaria, Doctor | **Historia Usuario** | HU-14 |
| **Pre-condición** | El actor ha iniciado sesión en el sistema y tiene los permisos necesarios. |  |  |
| **Post-condición** | El actor puede visualizar el listado de insumos con su stock actual. |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. El actor selecciona la opción "Inventario" en el sistema. |  |   |  |
| 2\. El sistema presenta la pantalla del Módulo Inventario. |  |  |  |
| 3\. El actor selecciona "Gestión de Movimientos de Stock". |  |   |  |
| 3\. El sistema muestra un listado de todos los con su tipo, fecha, cantidad, insumo, usuario, rol del usuario y estado. |  |  |  |
| 4\. El actor visualiza la información necesaria. |  |   |  |
| 5\. El actor sale del listado de movimientos en el stock. |  |   |  |
| 6\. El caso de uso termina. |  |  |  |

## Edición de movimiento en inventario {#edición-de-movimiento-en-inventario}

| Nombre | Editar movimiento en inventario | Codigo | CU-MI-06 |
| ----- | ----- | ----- | ----- |
| **Actores** | Secretaria, Doctor | **Historia Usuario**  | HU-12 |
| **Pre-condición** | El actor ha iniciado sesión en el sistema y tiene los permisos necesarios. El movimiento de inventario a editar existe.  |  |  |
| **Post-condición** | Los campos del movimiento de inventario han sido actualizados. El stock del insumo afectado ha sido recalculado correctamente.  |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. El actor accede a la sección de movimientos de inventario. |  |   |  |
| 2\. El sistema muestra un listado de movimientos de inventario. |  |   |  |
| 3\. El actor selecciona el movimiento que desea editar. |  | 3a. Movimiento no encontrado. Si el movimiento seleccionado no existe, el sistema muestra un mensaje de error y el caso de uso termina. |  |
| 4\. El actor selecciona la opción "Editar movimiento". |  |   |  |
| 5\. El sistema presenta un formulario con los detalles del movimiento seleccionado, permitiendo editar tipo y cantidad de insumo. |  |   |  |
| 6\. El actor modifica los campos deseados. |  |   |  |
| 7\. El actor guarda los cambios. |  |   |  |
| 8\. El sistema valida los nuevos valores. |  | 8a. Validación de datos fallida. Si los nuevos valores no cumplen las reglas de validación (ej. cantidad negativa), el sistema muestra un mensaje de error indicando los problemas y regresa al paso 5\. |  |
| 9\. El sistema actualiza el movimiento de inventario en la base de datos. |  |   |  |
| 10\. El sistema regresa al listado de movimientos de inventario, mostrando los cambios. |  |   |  |
| 11\. El caso de uso termina. |  |  |  |

## Registro de movimiento en inventario {#registro-de-movimiento-en-inventario}

| Nombre | Registrar movimiento | Codigo | CU-MI-07 |
| ----- | ----- | ----- | ----- |
| **Actores** | Secretaria, Doctor | **Historia Usuario** | HU-11 |
| **Pre-condición** | El actor ha iniciado sesión y tiene permisos para registrar movimientos de inventario. |  |  |
| **Post-condición** | Se registra un movimiento en el inventario y el stock del insumo afectado se actualiza. |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. El actor selecciona la opción para registrar un movimiento de inventario. |  |   |  |
| 2\. El sistema presenta un formulario para el registro del movimiento. |  |   |  |
| 3\. El actor ingresa los datos del movimiento: tipo (entrada/salida), cantidad y el insumo afectado (AC1). |  |   |  |
| 4\. El sistema valida los datos ingresados (AC2). |  | 4a. Datos inválidos. El sistema muestra un mensaje de error indicando los campos inválidos y regresa al paso 2\. |  |
| 5\. El actor guarda el registro. |  |   |  |
| 6\. El sistema registra el movimiento y actualiza el stock del insumo afectado según el tipo de movimiento (entrada aumenta, salida disminuye). |  |   |  |
| 7\. El sistema redirige al listado de movimientos. |  |   |  |
| 8\. El caso de uso termina. |  |  |  |

## Cancelar movimiento en inventario {#cancelar-movimiento-en-inventario}

| Nombre | Cancelar movimiento  | Codigo | CU-MI-08 |
| ----- | ----- | ----- | ----- |
| **Actores** | Secretaria, Doctor | **Historia Usuario**  | HU-14 |
| **Pre-condición** | El actor ha iniciado sesión en el sistema y tiene los permisos necesarios. El movimiento de stock a cancelar existe en el sistema. |  |  |
| **Post-condición** | El movimiento de stock seleccionado está marcado como estado cancelado y no aparece en listados para operaciones diarias, pero su historial se conserva. |  |  |
| **Curso Normal** |  | **Curso Alternativo** |  |
| 1\. El actor accede a la gestión de movimientos en el stock. |  |   |  |
| 2\. El sistema muestra el listado de movimientos en el stock. |  |   |  |
| 3\. El actor observa el movimiento que desea cancelar. |  |  |  |
| 4\. El actor selecciona la opción "Eliminar". |  |   |  |
| 5\. El sistema solicita confirmación para la desactivación. |  |   |  |
| 6\. El actor confirma la acción. |  | 6a. El actor cancela la acción. Si el actor cancela la acción, el sistema no realiza la desactivación y regresa al paso 2\. |  |
| 7\. El sistema actualiza el tipo de estado a cancelado y descarta su acumulación del total de stock para ese insumo. |  |   |  |
| 8\. El actor observa el movimiento aún visible en el listado, pero cancelado. |  |   |  |
| 9\. El caso de uso termina. |  |  |  |

### ***BPMN de los procesos realizados*** {#bpmn-de-los-procesos-realizados}

* Procesos generales

![][image26]

![][image27]

* Procesos en módulo de seguridad

![][image28]

![][image29]

* Procesos en módulo de Inventario

![][image30]![][image31]![][image32]

![][image33]

![][image34]![][image35]![][image36]

![][image37]

* Módulo de facturación

![][image38]![][image39]![][image40]

### ***Diseño de interfaces de entrada, procesos y salidas.*** {#diseño-de-interfaces-de-entrada,-procesos-y-salidas.}

* Generales

***Entrada***

![][image41]

| Caso de Uso: | CU-01 |
| :---- | :---- |
| Detalle de Pantalla: | 1\. Se mostrará un formulario centrado en pantalla con dos campos de entrada: **Usuario** y **Contraseña**. 2\. El botón **Iniciar Sesión** estará deshabilitado si los campos están vacíos. 3\. Al hacer clic en el botón, se validará la existencia del usuario y la coincidencia de credenciales. 4\. En caso de error, se mostrará un mensaje indicando credenciales incorrectas. 5\. Si los datos son correctos, se redireccionará al menú principal, según el rol del usuario autenticado.  |
| Observaciones: |  El campo de contraseña deberá estar oculto (tipo password) |

![][image42]

| Caso de Uso: | CU-02 |
| :---- | :---- |
| Detalle de Pantalla: | 1\. Se muestra un recuadro con los datos personales del usuario autenticado: **Usuario**, **Correo Electrónico**, **Nombre**, **Apellido** y **Rol**. 2\. Toda la información es de solo lectura. 3\. El botón **Editar** permite acceder a la pantalla de edición del perfil. 4\. El diseño mantiene el menú lateral visible para navegación entre módulos.  |
| Observaciones: |  |

![][image43]

| Caso de Uso: | CU-02 |
| :---- | :---- |
| Detalle de Pantalla: | 1\. Se mostrará un formulario editable con los siguientes campos precargados: Usuario (no editable) Correo Electrónico Nombre Apellido Contraseña (campo oculto tipo password) 2\. El campo **Rol** no está visible ni editable por el usuario desde esta vista. 3\. El botón **Editar** actualiza los datos modificados y muestra una notificación de éxito si todo es válido. 4\. El botón **Cancelar** retorna a la vista de perfil sin guardar cambios. 5\. Todos los campos requeridos deben validarse antes de permitir el envío del formulario.  |
| Observaciones: | La contraseña puede dejarse vacía si no se desea cambiarla. El campo de correo electrónico debe validarse con formato correcto. |

* Modulo Seguridad

***Entradas***

Crear usuario

| Caso de Uso: | CU-MS-02 |
| :---- | :---- |
| Detalle de Pantalla: | 1\. Se muestra un formulario con los campos: Usuario, Correo Electrónico, Nombre, Apellido, Contraseña y Rol. 2\. El campo “Rol” es un campo de selección con opciones predefinidas: administrador, doctor, secretaria. 3\. Los campos de entrada validan formato (correo electrónico, texto, contraseña segura). 4\. Al presionar el botón **Agregar**, se enviarán los datos al servidor para su almacenamiento, siempre que pasen validación. 5\. El botón **Cancelar** limpia el formulario o redirige a la pantalla de listado de usuarios. |
| Observaciones: | Todos los campos son obligatorios. El nombre de usuario y el correo electrónico deben ser únicos. La contraseña debe cumplir con una longitud mínima segura (recomendado: al menos 8 caracteres). |

Editar Usuario

![][image44]

| Caso de Uso: | CU-MS-04 |
| :---- | :---- |
| Detalle de Pantalla: | 1\. Se muestra un formulario con los campos: Usuario, Correo Electrónico, Nombre, Apellido, Contraseña y Rol. 2\. El campo “Rol” es un campo de selección con opciones predefinidas: administrador, doctor, secretaria. 3\. Los campos de entrada validan formato (correo electrónico, texto). 4\. Al presionar el botón **Agregar**, se enviarán los datos al servidor para su almacenamiento, siempre que pasen validación. 5\. El botón **Cancelar** redirige a la pantalla de listado de usuarios. |
| Observaciones: | Todos los campos son obligatorios. El nombre de usuario y el correo electrónico deben ser únicos. |

***Procesos***

Listar usuarios

![][image45]

| Caso de Uso: | CU-MS-05 |
| :---- | :---- |
| Detalle de Pantalla: | 1\. Se muestra una tabla que lista todos los usuarios del sistema registrados hasta el momento. 2\. La tabla contiene las siguientes columnas: Usuario, Correo, Nombre, Apellido, Rol, Editar y Eliminar. 3\. Cada fila incluye botones de acción: **Editar** (ícono de lápiz) que redirige al formulario con los datos precargados. **Eliminar** (ícono de papelera) que solicita confirmación antes de eliminar el registro. 4\. En la parte superior derecha, un botón **Agregar Usuario** redirige al formulario de creación de usuario.  |
| Observaciones: | Las acciones deben estar protegidas por los permisos del rol actual del usuario. |

Eliminar Usuario

![][image46]

| Caso de Uso: | CU-MS-03 |
| :---- | :---- |
| Detalle de Pantalla: | 1\. Se muestra un cuadro modal superpuesto sobre la lista de usuarios. 2\. El mensaje de confirmación indica claramente qué usuario está por eliminarse, con su nombre de **usuario**. 3\. Se presentan dos botones de acción: **Aceptar** (botón verde): confirma la eliminación del usuario. **Cancelar** (botón rojo): cierra el modal sin realizar ninguna acción. 4\. Al confirmar, el sistema elimina el registro del usuario de la base de datos. 5\. Al cancelar, se cierra el cuadro y la lista de usuarios permanece sin cambios.  |
| Observaciones: |   |

* Modulo Facturacion

![][image47]

| Caso de Uso: | CU-Fac 01 |
| :---- | :---- |
| Detalle de Pantalla: | 1\. Se muestra un menu con dos botones, 2\. Al darle click a cualquiera redirigirá a una de las paginas correspondientes |
| Observaciones: |   |

![][image48]

| Caso de Uso: | CU-Fac 02 |
| :---- | :---- |
| Detalle de Pantalla: | 1\. Se muestra un formulario para registrar una nueva factura. 2\. El formulario contiene campos para: ID de la factura (solo lectura). Fecha de emisión (selector de fecha). Método de pago (menú desplegable con opciones como efectivo, tarjeta, etc.). Estado (menú desplegable con opciones como aceptada, pendiente, cancelada). 3\. Sección de “Detalles” con la capacidad de agregar múltiples filas con: Descripción del producto o servicio. Precio unitario. Cantidad. Botón para eliminar cada detalle individual. 4\. Botón **Agregar Detalle** para añadir nuevas líneas al listado. 5\. Botón **Guardar Factura** para enviar los datos al servidor. 6\. Botón **Cancelar** para salir sin guardar y regresar a la pantalla anterior. |
| Observaciones: |   |

![][image49]

| Caso de Uso: | CU-Fac 03 |
| :---- | :---- |
| Detalle de Pantalla: | 1.Se presenta un formulario para editar una factura previamente registrada. 2\. Los campos mostrados incluyen: Fecha de emisión (campo editable con selector de fecha). Método de pago (menú desplegable con opciones como efectivo, tarjeta, etc.). Estado de la factura (menú desplegable: Aceptada, Pendiente, Cancelada). 3\. Sección “Detalles” que permite modificar una o varias líneas de productos/servicios con: Descripción (campo de texto). Precio unitario (campo numérico). Cantidad (campo numérico). Botón **Eliminar** para remover una línea específica. 4\.  Botón **Agregar Detalle** para insertar una nueva fila de detalle. 5\. Botón **Guardar Cambios** para actualizar los datos en el sistema.  |
| Observaciones: | 1.Si el estado de la factura es **CANCELADA**, el botón "Guardar Cambios" debe estar deshabilitado o la edición debe ser bloqueada. 2.No se permite guardar si no hay al menos un detalle agregado. 3.El ID de factura no es visible ni editable.  |

| Caso de Uso: | CU-Fac 04 |
| :---- | :---- |
| Detalle de Pantalla: | 1.Se muestra el título **Editar Factura** en la parte superior.   2.Para cada factura cancelada, se presenta en un bloque con: Identificador: **Factura \#00** Fecha: **2025-08-00** Método de pago: **efectivo** Estado: **Cancelada** Monto total: **$00.00** 3\. La sección **Detalles** se presenta en campos de solo lectura, sin op-ción de edición. 4\.  No se muestran botones para: Guardar Cambios Agregar Detalle Eliminar Detalle 5\. La interfaz está diseñada para solo visualización de facturas **canceladas**. 6\. La barra lateral de navegación permanece visible como en todas las pantallas del sistema.  |
| Observaciones: | Los campos de factura cancelada están deshabilitados para evitar cambios accidentales. Esto aplica solo cuando el estado es **Cancelada**, y se verifica dinámicamente. Se mantiene coherencia visual con la versión editable para facilitar el reconocimiento por parte del usuario. |

![][image50]

| Caso de Uso: | CU-Fac 05 |
| :---- | :---- |
| Detalle de Pantalla: | 1\.  Se muestra una ventana modal superpuesta con fondo oscurecido. 2\. El centro de la ventana contiene: Un ícono de advertencia (\!) El mensaje: **¿Deseas cancelar la factura?** 3\. Se presentan dos botones claramente diferenciados: **Aceptar** (color verde): confirma la acción y procede con la cancelación de la factura. **Cancelar** (color rojo): cierra el modal y no realiza ninguna acción. 4\. El fondo de la pantalla base queda inactivo mientras el modal está activo.  |
| Observaciones: | 1\.  La acción **Aceptar** debería invocar la función correspondiente para actualizar el estado de la factura a **CANCELADA**. 2\.  Este tipo de confirmación ayuda a prevenir cancelaciones accidentales. |

* Modulo Inventario

***Entradas***

Registro de Nuevo Insumo

![][image51]

| Caso de Uso: | CU-MI-04 |
| :---- | :---- |
| Detalle de Pantalla: | Se muestra un formulario centrado en la pantalla bajo el título "Crear Nuevo Insumo". El formulario contiene dos campos de texto para ingresar la información del material: "Nombre del insumo" y "Descripción". En la parte inferior se ubican dos botones de acción: Agregar: Confirma y guarda el nuevo insumo en la base de datos, redirigiendo al usuario al listado principal. Cancelar: Descarta los datos ingresados y regresa al listado de insumos sin realizar cambios.  |
| Observaciones: | Todos los campos son obligatorios. |

Editar Insumo

![][image52]

| Caso de Uso: | CU-MI-03 |
| :---- | :---- |
| Detalle de Pantalla: | Se muestra un formulario centrado en la pantalla con el título "Editar Insumo". El formulario contiene los campos "Nombre del insumo" y "Descripción", los cuales aparecen precargados con los datos actuales del insumo seleccionado. En la parte inferior se encuentran dos botones de acción: Agregar: Guarda los cambios realizados en la información del insumo y regresa al listado. Cancelar: Descarta las modificaciones y redirige al usuario de vuelta al listado de insumos.  |
| Observaciones: | Los campos no pueden quedar vacíos al momento de guardar los cambios.  |

Realizar Movimiento

![][image53]

| Caso de Uso: | CU-MI-07 |
| :---- | :---- |
| Detalle de Pantalla: | 1\. Se muestra un formulario con los campos: Tipo, cantidad, insumo. 2\. El campo “Tipo de movimiento” es un campo de selección con opciones predefinidas: entrada, salida. 3\. El campo cantidad validad números negativos. 4.El campo de la fecha esta desactivado y no se puede interactuar con el solo muestra la fecha que el sistema agregara  5\. Al presionar el botón **Agregar**, se enviarán los datos al servidor para su almacenamiento, siempre que pasen validación. 6\. El botón **Cancelar** limpia el formulario o redirige a la pantalla de registro de movimientos. |
| Observaciones: | Todos los campos son obligatorios. La cantidad no puede ser negativa ni igual a cero.  |

Editar movimiento en el stock

![][image54]

| Caso de Uso: | CU-MI-06 |
| :---- | :---- |
| Detalle de Pantalla: | 1\. Se muestra un formulario con los campos: cantidad y tipo de movimiento. 2\. El campo “tipo de movimiento” es un campo de selección con opciones predefinidas: entrada, salida. 3\. El campo de cantidad valida datos de entrada. 4\. Al presionar el botón **Agregar**, se enviarán los datos al servidor para su almacenamiento, siempre que pasen validación. 5\. El botón **Cancelar** redirige a la pantalla de registro de movimientos. |
| Observaciones: | Todos los campos son obligatorios. La cantidad debe ser distinta de cero y positiva. |

***Procesos***

Consultar Insumos

![][image55]

| Caso de Uso: | CU-MI-01 |
| :---- | :---- |
| Detalle de Pantalla: | 1\. Se muestra una tabla que lista todos los insumos registrados en el sistema, bajo el título "Gestión de Insumos". 2\. La tabla contiene las siguientes columnas: Nombre, Descripción, Stock Actual, Editar y Eliminar. 3\. Cada fila representa un insumo y presenta dos botones de acción: \- Editar (ícono de lápiz): Redirige al formulario para modificar los detalles del insumo (nombre y descripción). \- Eliminar (ícono de papelera): Inicia el proceso para desactivar un insumo. 4\. En la parte superior derecha, un botón prominente Agregar Insumo permite al usuario acceder a la pantalla para registrar un nuevo insumo en el inventario.  |
| Observaciones: | \- El listado debe mostrar los insumos activos por defecto. |

Consultar movimientos

![][image56]

| Caso de Uso: | CU-MI-05 |
| :---- | :---- |
| Detalle de Pantalla: | 1\. Se muestra una tabla que lista todos los movimientos realizados y cancelados. 2\. La tabla contiene las siguientes columnas: Tipo, Fecha, Cantidad, Insumo, Nombre usuario, Rol usuario, Estado. 3\. Cada fila incluye botones de acción: **Editar** (ícono de lápiz) que redirige al formulario con los datos precargados. **Eliminar** (ícono de papelera) que solicita confirmación antes de eliminar el registro. 4\. En la parte superior derecha, un botón **Realizar movimiento** redirige al formulario de realización de un movimiento.  |
| Observaciones: | Se muestra como “Descatalogado” los insumos que han sido borrados del sistema. En este aparecen advertencias como Toast si se quiere editar un movimiento ya cancelado o si se quiere cancelar una entrada que ya fue afectada por una o mas salidas. |

Desactivar insumo

![][image57]

| Caso de Uso: | CU-MI-02 |
| :---- | :---- |
| Detalle de Pantalla: | Al hacer clic en el ícono de "Eliminar" de un insumo en el listado, se despliega un cuadro modal superpuesto. El modal muestra un mensaje de confirmación que especifica el nombre del insumo que se va a desactivar (ej. "¿Estas seguro de eliminar el insumo Gasas estériles?"). Se presentan dos botones de acción para que el usuario decida: Aceptar (botón verde): Confirma la desactivación del insumo, el cual dejará de estar visible en el listado principal. \- Cancelar (botón rojo): Cierra el cuadro modal y cancela la operación, sin realizar ningún cambio.  |
| Observaciones: | La funcionalidad corresponde a una desactivación, no eliminación definitiva, para mantener la integridad del historial de movimientos del insumo. |

Cancelar movimiento

![][image58]

| Caso de Uso: | CU-MI-08 |
| :---- | :---- |
| Detalle de Pantalla: | 1\. Se muestra un cuadro modal superpuesto. 2\. El mensaje de confirmación indica fecha y tipo de movimiento que se va a cancelar. 3\. Se presentan dos botones de acción: **Aceptar** (botón verde): confirma la cancelacion. **Cancelar** (botón rojo): cierra el modal sin realizar ninguna acción. 4\. Si se confirma la acción, el sistema marca el estado del movimiento como “Cancelado” y revierte el efecto en el stock 5\. Al cancelar, se cierra el cuadro y el registro permanece sin cambios.  |
| Observaciones: |  |

### ***Diseño de base de datos*** {#diseño-de-base-de-datos}

* **Modelo físico**

* **Diccionario de datos**

**Tabla usuarios\_usuario**

| Campo | Índice | Tipo de datos | Descripción |
| :---: | :---: | :---: | :---: |
| **id** | Primary key | Integer | Identificador único autoincrementable del usuario |
| **usuario** |  | ChaField (max\_length=100) | Nombre del usuario único para Login. |
| **email** |  | CharField (max\_length=254) | Correo electrónico único para el usuario. |
|  **nombre** |  | CharField (max\_length=200) | Nombre del usuario |
| **apellido** |  | CharField (max\_length=200) | Apellidos del usuario |
| **rol** |  | CharField (max\_length=20) | Rol del usuario en el sistema |
| **password** |  | CharField | Contraseña del usuario en formato encriptado (Hash) |
| **last\_login** |  | DateTimeField | Fecha y hora del último inicio de sesión exitoso |
| **usuario\_activo** |  | BooelanField | Indica si el usuario está habilitado para acceder al sistema. |
| **usuario\_administrador** |  | BooleanField | Determina si tiene permisos de administrador/staff. |

**Tabla facturacion\_factura**

| Campo | Índice | Tipo de datos | Descripción |
| :---: | ----- | :---: | :---: |
| **idfactura** | Primary key | Integer | Identificador único  |
| **Fecha\_emision** |  | DateField() | Fecha por calendario. |
| **monto\_total** |  | DecimalField(max\_digits=19) | Monto total de los servicios  |
| **metodo\_pago** |  | CharField(max\_length=20) | Forma de pago |
| **estado** |  | CharField(max\_length=30) | Estado en el que se encuentra la factura |
| **activo** |  | BooelanField | Indica si la factura está disponible. |

**Tabla facturación\_facturadetalle**

| Campo | Índice | Tipo de datos | Descripción |
| :---: | :---: | :---: | :---: |
| ***idDetalleFactura*** | Primary Key | integer | Identificador único del detalle de factura. |
| **descripción** |  | CharField (max\_length=50) | Descripción del producto o servicio facturado. |
| **precio\_unitario** |  | DecimalField (max\_digits=10, decimal\_places=2) | Precio por unidad del ítem facturado. |
| **Cantidad** |  | IntegerField | Número de unidades del ítem facturado |
| **idfactura** | Foreignkey | Char | Identificador de la factura a la que pertenece este detalle |

**Tabla inventario\_insumo**

| Campo | Índice | Tipo de datos | Descripción |
| :---: | :---: | :---: | ----- |
| **id** | Primary key | Integer | Identificador único para cada insumo registrado en el inventario. |
| **nombre** |  | CharField (max\_length=100) | Nombre comercial o descriptivo del insumo. |
| **descripción** |  | CharField (max\_length=255)  | Detalles adicionales del insumo. |
| **stock\_actual** |  | Integer | Cantidad actual de unidades del insumo disponibles en el inventario. |
| **activo** |  | BooleanField(default=True) | Indicador de estado para saber si el insumo está en uso (verdadero) o si ha sido descontinuado (falso). |

**Tabla inventario\_movimiento\_stock**

| Campo | Índice | Tipo de datos | Descripción |
| :---: | :---: | :---: | :---: |
| **id** | Primary key | Integer | Identificador único autoincrementable del movimiento en inventario |
| **tipo** |  | CharField (max\_length=10) | Representa la naturaleza del movimiento en stock, si es una entrada o salida de insumos |
| **fecha** |  | DateField(auto\_now\_add=True)  | Fecha en que se realizó el movimiento |
| **cantidad** |  | Integer | Numero de insumos que se movieron |
| **nombre\_usuario** |  | CharField (max\_length=150) | Nombre del usuario que realizo el movimiento |
| **rol\_usuario** |  | CharField (max\_length=100) | Rol del usuario que hizo el movimiento |
| **activo** |  | BooleanField(default=True) | Estado del movimiento |
| **usuario** | ForeingKey | Integer | Id del usuario que hizo el movimiento |

6. # **Sprint Retrospective.** {#sprint-retrospective.}

***¿Qué salió bien?***

* Se logró implementar correctamente la autenticación de usuarios mediante JWT.  
* El equipo mantuvo una buena comunicación diaria durante las reuniones Scrum.  
* Se completaron historias clave del módulo de Seguridad, como creación, edición y listado de usuarios.  
* Se utilizó correctamente Git para el control de versiones, evitando conflictos.

 ***¿Qué podría mejorarse?***

* La estimación de tiempos no fue del todo precisa: algunas tareas fueron más complejas de lo anticipado.  
* Hubo retraso en la integración de algunos módulos por falta de definición de dependencias técnicas.

***¿Qué haremos diferente en el próximo Sprint?***

* Planificaremos más detalladamente las tareas técnicas antes de iniciar el desarrollo.  
* Definiremos con anticipación qué endpoints se deben consumir entre frontend y backend.  
* Se establecerán reuniones técnicas a mitad del Sprint para resolver posibles problemas que surgan.

7. # **Video de funcionalidades entregadas.** {#video-de-funcionalidades-entregadas.}

Carpeta en Drive donde se aloja el video:

[https://drive.google.com/drive/folders/1o8B2RGK14RJi8BuCeGTunrvItJr0nsNk?usp=sharing](https://drive.google.com/drive/folders/1o8B2RGK14RJi8BuCeGTunrvItJr0nsNk?usp=sharing)

8. # **Enlace para comprobación de código.** {#enlace-para-comprobación-de-código.}

Repositorio del Frontend hecho con React

[https://github.com/CarlosRauda64/Frontend-Dentifia.git](https://github.com/CarlosRauda64/Frontend-Dentifia.git)

Repositorio del Backend hecho con Django

[https://github.com/CarlosRauda64/Dentifia-Backend.git](https://github.com/CarlosRauda64/Dentifia-Backend.git) 

9. # **Sitio de prueba de la aplicación** {#sitio-de-prueba-de-la-aplicación}

El Frontend esta alojado en Vercel y el Backend está alojado en Render, este último puede ser un poco lento debido a que se posee hosting gratuito, la primera carga siempre es la más lenta después de eso el flujo es más rápido.

[https://frontend-dentifia.vercel.app/](https://frontend-dentifia.vercel.app/) 

Credenciales para ingresar: 

* Usuario: admin  
* Contraseña: admin123
