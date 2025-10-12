# Marco Teórico - Parte 1: Pruebas de Software

La **automatización de pruebas** es el uso de software para ejecutar actividades de prueba (diseño, ejecución, verificación de resultados y gestión) de forma automatizada. Sus principales objetivos son acelerar las regresiones, aumentar la cobertura de pruebas, garantizar repetibilidad y habilitar CI/CD (Integración y Despliegue Continuo). El estándar **ISO/IEC/IEEE 29119** establece los procesos y documentación de prueba, incluyendo pruebas automatizadas. Las buenas prácticas incluyen el uso de patrones como **Page Object Model (POM)**, sincronización robusta, ejecución paralela y trazabilidad integrada.

## Herramientas

### Selenium (WebDriver + Grid)

**Selenium** es el framework de automatización de navegadores más establecido y ampliamente utilizado. Permite automatizar navegadores reales con soporte oficial para múltiples lenguajes de programación.

**Características principales:**
- **Lenguajes:** Java, Python, C#, JavaScript, Ruby, entre otros
- **Navegadores:** Chrome, Firefox, Edge, Safari (vía drivers)
- **Selenium Manager:** Gestiona drivers automáticamente desde la versión 4.x
- **Selenium Grid:** Distribuye y escala ejecuciones en múltiples máquinas
- **Licencia:** Open source (Apache 2.0)

**Ventajas:** Ecosistema maduro, flexibilidad de lenguajes/plataformas, escalabilidad mediante Grid, documentación extensa.

**Desventajas:** Curva de aprendizaje media, requiere configuración inicial, sincronización manual en algunos casos.

### Playwright

**Playwright** es un framework moderno de Microsoft para pruebas E2E (End-to-End), diseñado para aplicaciones web modernas con enfoque en rendimiento y confiabilidad.

**Características principales:**
- **Lenguajes:** JavaScript/TypeScript, Python, Java y .NET
- **Navegadores:** Chromium, Firefox y WebKit
- **Auto-waiting:** Esperas inteligentes integradas
- **Trace Viewer:** Herramienta de depuración con trazas navegables
- **Licencia:** Open source (Apache 2.0)

**Ventajas:** Auto-waiting reduce problemas de sincronización, excelente para pruebas E2E modernas, Trace Viewer facilita depuración, guías para CI/CD.

**Desventajas:** Comunidad más pequeña que Selenium, menos recursos de aprendizaje disponibles.

### Cypress

**Cypress** es un framework centrado en la experiencia del desarrollador para pruebas E2E y de componentes en aplicaciones web, con interfaz visual interactiva.

**Características principales:**
- **Lenguajes:** JavaScript/TypeScript únicamente
- **Navegadores:** Chrome/Edge (Chromium), Firefox y WebKit
- **Time-travel:** Permite revisar el estado de la aplicación en cada paso
- **Depuración interactiva:** Integrada con Chrome DevTools
- **Licencia:** Open source (runner) + add-ons comerciales en la nube

**Ventajas:** Excelente experiencia de desarrollador (DX), feedback rápido, interfaz visual intuitiva, ideal para equipos frontend.

**Desventajas:** Limitado a JavaScript/TypeScript, algunas limitaciones arquitectónicas por ejecutarse dentro del navegador.

### Katalon Studio

**Katalon Studio** es una plataforma de automatización low-code orientada a equipos QA que buscan productividad sin experiencia profunda en programación.

**Características principales:**
- **Tipos de pruebas:** Web, Mobile, API, Desktop
- **Interfaz:** Low-code con grabación de acciones (record & playback)
- **KRE:** Katalon Runtime Engine para orquestación y ejecución
- **Navegadores:** Chrome, Firefox, Edge
- **Licencia:** Comercial (planes desde ~USD 84/mes), con versión gratuita limitada

**Ventajas:** Baja curva de aprendizaje, soporte nativo para pruebas de API, reportes integrados, ideal para QA sin experiencia en código.

**Desventajas:** Modelo de licenciamiento comercial, menos flexibilidad que soluciones basadas en código, dependencia de la plataforma.

## Cuadro Comparativo

| Criterio | Selenium | Playwright | Cypress | Katalon Studio |
|---|---|---|---|---|
| **Licencia** | Open-source (Apache 2.0) | Open-source (Apache 2.0) | Open-source + add-ons comerciales | Comercial (~USD 84/mes) |
| **Lenguajes** | Java, Python, C#, JS, Ruby | JS/TS, Python, Java, .NET | JS/TS | Groovy + low-code |
| **Navegadores** | Chrome, Firefox, Edge, Safari | Chromium, Firefox, WebKit | Chrome/Edge, Firefox, WebKit | Chrome, Firefox, Edge |
| **Gestión de drivers** | Selenium Manager (auto) | `playwright install` | Nativo del navegador | Gestionado por plataforma |
| **API testing** | No nativo (libs externas) | APIRequestContext | `cy.intercept` | Soporte nativo |
| **Paralelismo / CI** | Selenium Grid + CI amplio | Guías CI listas | Integración CI | TestOps/KRE |
| **Depuración** | Según lenguaje | Trace Viewer | Time-travel + DevTools | Reportes/dashboards |
| **Curva aprendizaje** | Media | Media | Baja-media | Baja |
| **Casos ideales** | Cross-browser, flexibilidad, escala | E2E moderno, multi-motor | Frontend, DX, feedback rápido | QA funcional, productividad |

## Elección: Selenium

Se ha seleccionado **Selenium** como herramienta de automatización de pruebas por las siguientes razones:

1. **Funciona con varios lenguajes de programación:** Puedes usarlo con Python, Java, JavaScript, C# y otros, adaptándose a lo que ya conozcas o necesites aprender.

2. **Compatible con todos los navegadores:** Funciona en Chrome, Firefox, Edge y Safari, permitiendo probar en diferentes navegadores sin cambiar de herramienta.

3. **Fácil de instalar:** Desde la versión 4, Selenium Manager descarga e instala automáticamente lo necesario, simplificando la configuración inicial.

4. **Comunidad grande y activa:** Cuenta con mucha documentación, tutoriales y foros donde resolver dudas, lo que facilita el aprendizaje.

5. **Gratuito y sin restricciones:** Es de código abierto (Apache 2.0), sin costos de licencia y puede usarse libremente en cualquier proyecto.



## Guía de Instalación de Selenium

Esta guía detalla la instalación de **Selenium WebDriver** con **Python** en **Windows**, dejando un entorno listo para ejecutar pruebas automatizadas en **Google Chrome**. Desde Selenium 4.x, **Selenium Manager** gestiona los drivers automáticamente, eliminando la necesidad de descargas manuales.

**Prerrequisitos**

1. **Python 3.8 o superior** instalado en el sistema
2. **Navegador web** instalado (Chrome, Firefox o Edge)
3. **Conexión a internet** (Selenium Manager descarga drivers cuando es necesario)

**Paso 1: Verificar la instalación de Python**

Abra PowerShell o CMD y ejecute:

```bash
py --version
```

Debería ver la versión de Python instalada (ej: `Python 3.9.7`). También verifique pip:

```bash
py -m pip --version
```

**Paso 2: Crear un entorno virtual (opcional pero recomendado)**

Es buena práctica crear un entorno virtual para aislar las dependencias del proyecto:

```bash
# Navegar a la carpeta del proyecto
cd ruta\de\tu\proyecto

# Crear entorno virtual
py -m venv venv

# Activar el entorno virtual
venv\Scripts\activate
```

**Paso 3: Instalar Selenium**

Con el entorno virtual activado (o en el sistema global), instale Selenium:

```bash
py -m pip install selenium
```

Para verificar la instalación:

```bash
py -m pip show selenium
```

**Paso 4: Crear un script de prueba**

Cree un archivo `test_selenium.py` con el siguiente contenido:

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_basic_selenium():
    """Prueba básica de Selenium"""
    print("Iniciando navegador Chrome...")
    
    # Selenium Manager gestiona chromedriver automáticamente
    driver = webdriver.Chrome()
    
    try:
        # Navegar a la página
        driver.get("https://example.org")
        
        # Esperar a que cargue el elemento h1
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "h1"))
        )
        
        # Obtener título
        print(f"Título: {driver.title}")
        
        # Verificar contenido
        assert "Example Domain" in driver.title
        
        print("Prueba exitosa!")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    test_basic_selenium()
```

**Paso 5: Ejecutar la prueba**

```bash
py test_selenium.py
```

Si todo está correcto, verá cómo se abre Chrome, navega a la página, y se cierra automáticamente mostrando "Prueba exitosa!" en la consola.

**Paso 6: Uso con otros navegadores**

Para **Firefox**:
```python
driver = webdriver.Firefox()
```

Para **Edge**:
```python
driver = webdriver.Edge()
```

Selenium Manager descargará el driver correspondiente automáticamente.
