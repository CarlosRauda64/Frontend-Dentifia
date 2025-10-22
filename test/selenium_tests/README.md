# Pruebas Automatizadas con Selenium - DentiFIA

Este directorio contiene las pruebas automatizadas usando Selenium WebDriver para el sistema DentiFIA.

## Estructura de Archivos

```
selenium_tests/
├── config.py                 # Configuración general (URLs, credenciales, opciones)
├── base_test.py             # Clase base con utilidades comunes
├── requirements.txt         # Dependencias de Python
├── test_seguridad.py        # Pruebas del módulo de Seguridad (HU-01 a HU-06)
├── test_inventario.py       # Pruebas del módulo de Inventario (HU-07 a HU-14)
├── test_facturacion.py      # Pruebas del módulo de Facturación (HU-15 a HU-18)
├── run_all_tests.py         # Script para ejecutar todas las pruebas
├── screenshots/             # Capturas de pantalla de las pruebas
└── reports/                 # Reportes generados
```

## Requisitos Previos

1. **Python 3.8 o superior** instalado
2. **Google Chrome** instalado
3. **Backend de Django** corriendo en `http://127.0.0.1:8000`
4. **Frontend de React** corriendo en `http://localhost:5173`

## Instalación

1. Crear y activar entorno virtual:
```bash
cd test/selenium_tests
py -m venv venv
venv\Scripts\activate
```

2. Instalar dependencias:
```bash
py -m pip install -r requirements.txt
```

## Configuración

Editar `config.py` si es necesario para ajustar:
- URLs de frontend y backend
- Credenciales de prueba
- Opciones de Selenium (timeouts, directorios, etc.)

## Ejecución de Pruebas

### Ejecutar todas las pruebas:
```bash
py run_all_tests.py
```

### Ejecutar módulo específico:
```bash
# Módulo de Seguridad
py test_seguridad.py

# Módulo de Inventario
py test_inventario.py

# Módulo de Facturación
py test_facturacion.py
```

## Historias de Usuario Cubiertas

### Módulo de Seguridad (6 HU)
- **HU-01**: Inicio de Sesión
- **HU-02**: Creación de usuarios
- **HU-03**: Eliminación de usuario
- **HU-04**: Edición de usuarios
- **HU-05**: Listado de Usuarios
- **HU-06**: Editar Perfil

### Módulo de Inventario (8 HU)
- **HU-07**: Registro de nuevo insumo
- **HU-08**: Consulta de listado de insumos
- **HU-09**: Edición de datos de insumo
- **HU-10**: Desactivación de insumo
- **HU-11**: Registro de movimiento en inventario
- **HU-12**: Edición de movimiento en inventario
- **HU-13**: Consulta de listado de movimientos
- **HU-14**: Cancelar movimiento en inventario

### Módulo de Facturación (4 HU)
- **HU-15**: Cancelar Factura Emitida
- **HU-16**: Ver Historial de Facturas
- **HU-17**: Editar Factura
- **HU-18**: Crear Factura

## Resultados

- **Screenshots**: Se guardan automáticamente en `screenshots/`
- **Reportes**: Los resultados se generan en `reports/`
- **Logs**: Se imprimen en consola durante la ejecución

## Notas Importantes

- Asegurarse de que el backend y frontend estén corriendo antes de ejecutar las pruebas
- Las pruebas requieren datos de prueba en la base de datos
- Selenium Manager (incluido en Selenium 4.x) gestiona automáticamente el ChromeDriver


