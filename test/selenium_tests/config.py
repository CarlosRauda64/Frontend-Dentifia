"""
Configuración general para las pruebas de Selenium
"""

# Configuración de URLs
BASE_URL = "http://localhost:5173"
API_URL = "http://127.0.0.1:8000"

# Credenciales de prueba
CREDENTIALS = {
    "admin": {
        "usuario": "roderick",
        "password": "password",
        "rol": "administrador"
    }
}

# Configuración de Selenium
SELENIUM_CONFIG = {
    "implicit_wait": 10,  # segundos
    "page_load_timeout": 30,  # segundos
    "screenshot_dir": "test/selenium_tests/screenshots",
    "reports_dir": "test/selenium_tests/reports"
}

# Configuración de Chrome
CHROME_OPTIONS = [
    "--start-maximized",
    "--disable-blink-features=AutomationControlled",
    # "--headless",  # Descomentar para ejecutar sin UI
]


