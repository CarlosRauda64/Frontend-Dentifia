# Instrucciones para Ejecutar las Pruebas de Selenium

## Prerrequisitos

Antes de ejecutar las pruebas, asegúrese de tener:

1. **Backend corriendo** en `http://127.0.0.1:8000`
2. **Frontend corriendo** en `http://localhost:5173`
3. **Python 3.8+** instalado
4. **Google Chrome** instalado

## Paso 1: Configurar el Entorno Virtual

Abra PowerShell o CMD y navegue a la carpeta de pruebas:

```bash
cd test/selenium_tests
```

Cree y active el entorno virtual:

```bash
# Crear entorno virtual
py -m venv venv

# Activar entorno virtual
venv\Scripts\activate
```

## Paso 2: Instalar Dependencias

Con el entorno virtual activado, instale Selenium:

```bash
py -m pip install -r requirements.txt
```

## Paso 3: Verificar Configuración

Abra el archivo `config.py` y verifique que las URLs sean correctas:

```python
BASE_URL = "http://localhost:5173"
API_URL = "http://127.0.0.1:8000"
```

También verifique las credenciales de prueba:

```python
CREDENTIALS = {
    "admin": {
        "usuario": "roderick",
        "password": "password",
        "rol": "administrador"
    }
}
```

## Paso 4: Ejecutar las Pruebas

### Opción A: Ejecutar TODAS las pruebas (Recomendado)

```bash
py run_all_tests.py
```

Este comando ejecutará las 18 historias de usuario y generará reportes automáticos.

### Opción B: Ejecutar por módulo

```bash
# Solo módulo de Seguridad (HU-01 a HU-06)
py test_seguridad.py

# Solo módulo de Inventario (HU-07 a HU-14)
py test_inventario.py

# Solo módulo de Facturación (HU-15 a HU-18)
py test_facturacion.py
```

## Paso 5: Revisar Resultados

Después de ejecutar las pruebas:

1. **Consola**: Verá el progreso en tiempo real con mensajes detallados
2. **Screenshots**: Revise la carpeta `screenshots/` para ver capturas de pantalla
3. **Reportes**: Revise la carpeta `reports/` para ver reportes en JSON y Markdown

### Estructura de Resultados

```
selenium_tests/
├── screenshots/           # Capturas de pantalla de cada paso
│   ├── hu01_login_exitoso_20251012_143025.png
│   ├── hu02_formulario_crear_usuario_20251012_143130.png
│   └── ...
└── reports/              # Reportes generados
    ├── reporte_20251012_143000.json
    └── reporte_20251012_143000.md
```

## Solución de Problemas Comunes

### Error: "Module not found: selenium"

**Solución:** Asegúrese de que el entorno virtual esté activado y ejecute:
```bash
py -m pip install selenium
```

### Error: "Connection refused" o timeout

**Solución:** Verifique que:
- El backend esté corriendo en el puerto 8000
- El frontend esté corriendo en el puerto 5173
- No haya firewalls bloqueando las conexiones

### Error: "No se encontró ChromeDriver"

**Solución:** Selenium 4.x gestiona automáticamente el ChromeDriver. Si hay problemas:
```bash
py -m pip install --upgrade selenium
```

### Las pruebas fallan por datos faltantes

**Solución:** Algunas pruebas requieren datos existentes en la base de datos:
- Para editar/eliminar usuarios, debe haber usuarios registrados
- Para editar/eliminar insumos, debe haber insumos registrados
- Para trabajar con facturas, puede necesitar facturas previas

Puede ejecutar primero las pruebas de creación para generar datos.

## Interpretación de Resultados

### Estados de las Pruebas

- ✅ **PASÓ**: La prueba se ejecutó correctamente y cumplió con los criterios de aceptación
- ❌ **FALLÓ**: La prueba encontró un error o no cumplió con los criterios

### Formato de Salida

```
📋 [HU-XX] Prueba: Nombre de la prueba
----------------------------------------------------------------------
✅ PASÓ: Descripción del resultado
   └─ Detalles adicionales
```

### Tasa de Éxito

- **100%**: Excelente, todas las pruebas pasaron
- **80-99%**: Bueno, la mayoría pasó
- **50-79%**: Aceptable, revisar las fallas
- **<50%**: Necesita atención inmediata

## Ejecución en Modo Headless (Sin UI)

Para ejecutar las pruebas sin abrir el navegador (más rápido):

1. Abra `config.py`
2. Descomente la línea:
   ```python
   # "--headless",  # Descomentar para ejecutar sin UI
   ```
3. Guarde y ejecute normalmente

## Personalización

### Cambiar Tiempos de Espera

En `config.py`, ajuste:
```python
SELENIUM_CONFIG = {
    "implicit_wait": 10,      # Aumentar si la red es lenta
    "page_load_timeout": 30,  # Aumentar para páginas lentas
}
```

### Cambiar Directorio de Screenshots

En `config.py`:
```python
"screenshot_dir": "ruta/personalizada/screenshots",
```

## Limpieza

Para limpiar resultados anteriores:

```bash
# Eliminar screenshots antiguos
del screenshots\*.png

# Eliminar reportes antiguos
del reports\*.json
del reports\*.md
```

## Notas Importantes

1. **No interrumpa las pruebas** mientras se ejecutan, deje que terminen completamente
2. **Las pruebas modifican datos**: Crean, editan y eliminan registros
3. **Tiempo de ejecución**: La suite completa toma aproximadamente 5-10 minutos
4. **Primer ejecución**: Puede ser más lenta porque Selenium descarga ChromeDriver

## Contacto y Soporte

Si encuentra problemas, revise:
1. Los logs en consola
2. Los screenshots en `screenshots/`
3. El archivo `base_test.py` para debugging

---

**¡Buena suerte con las pruebas! 🚀**


