"""
Clase base para todas las pruebas de Selenium
Proporciona funcionalidad común como login, screenshots, waits, etc.
"""

import os
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from config import BASE_URL, CREDENTIALS, SELENIUM_CONFIG, CHROME_OPTIONS


class BaseTest:
    """Clase base con utilidades comunes para pruebas de Selenium"""
    
    def __init__(self):
        """Inicializa el driver de Selenium y configura directorios"""
        self.driver = None
        self.wait = None
        self.setup_directories()
    
    def setup_directories(self):
        """Crea los directorios necesarios para screenshots y reportes"""
        os.makedirs(SELENIUM_CONFIG["screenshot_dir"], exist_ok=True)
        os.makedirs(SELENIUM_CONFIG["reports_dir"], exist_ok=True)
    
    def setup_driver(self):
        """Configura e inicializa el driver de Chrome"""
        chrome_options = Options()
        for option in CHROME_OPTIONS:
            chrome_options.add_argument(option)
        
        # Selenium Manager gestiona el driver automáticamente desde Selenium 4.x
        self.driver = webdriver.Chrome(options=chrome_options)
        
        # Configurar timeouts
        self.driver.implicitly_wait(SELENIUM_CONFIG["implicit_wait"])
        self.driver.set_page_load_timeout(SELENIUM_CONFIG["page_load_timeout"])
        
        # Configurar WebDriverWait
        self.wait = WebDriverWait(self.driver, SELENIUM_CONFIG["implicit_wait"])
        
        print(f"✓ Driver de Chrome iniciado correctamente")
    
    def teardown_driver(self):
        """Cierra el navegador y limpia recursos"""
        if self.driver:
            self.driver.quit()
            print(f"✓ Driver cerrado correctamente")
    
    def login(self, rol="admin"):
        """
        Realiza el login en el sistema
        
        Args:
            rol: Tipo de usuario (admin, secretaria, doctor)
        """
        try:
            print(f"\n🔐 Iniciando sesión como {rol}...")
            
            # Navegar a la página de login
            self.driver.get(f"{BASE_URL}/")
            
            # Esperar que cargue el formulario
            self.wait.until(EC.presence_of_element_located((By.ID, "usuario")))
            
            # Obtener credenciales
            creds = CREDENTIALS[rol]
            
            # Ingresar usuario
            usuario_input = self.driver.find_element(By.ID, "usuario")
            usuario_input.clear()
            usuario_input.send_keys(creds["usuario"])
            
            # Ingresar contraseña
            password_input = self.driver.find_element(By.ID, "password")
            password_input.clear()
            password_input.send_keys(creds["password"])
            
            # Hacer clic en el botón de inicio de sesión
            submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            submit_button.click()
            
            # Esperar a que redirija al dashboard
            self.wait.until(EC.url_contains("/app"))
            
            print(f"✓ Login exitoso como {rol}")
            time.sleep(1)  # Pequeña pausa para que cargue completamente
            return True
            
        except Exception as e:
            print(f"✗ Error en login: {str(e)}")
            self.take_screenshot(f"error_login_{rol}")
            return False
    
    def take_screenshot(self, name):
        """
        Toma una captura de pantalla y la guarda
        
        Args:
            name: Nombre base del archivo (sin extensión)
        """
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{name}_{timestamp}.png"
            filepath = os.path.join(SELENIUM_CONFIG["screenshot_dir"], filename)
            
            self.driver.save_screenshot(filepath)
            print(f"📸 Screenshot guardado: {filename}")
            return filepath
        except Exception as e:
            print(f"✗ Error al tomar screenshot: {str(e)}")
            return None
    
    def wait_for_element(self, by, value, timeout=10):
        """
        Espera a que un elemento esté presente
        
        Args:
            by: Tipo de selector (By.ID, By.CSS_SELECTOR, etc.)
            value: Valor del selector
            timeout: Tiempo máximo de espera en segundos
        """
        try:
            element = WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((by, value))
            )
            return element
        except TimeoutException:
            print(f"✗ Timeout esperando elemento: {value}")
            return None
    
    def wait_for_clickable(self, by, value, timeout=10):
        """
        Espera a que un elemento sea clickeable
        
        Args:
            by: Tipo de selector
            value: Valor del selector
            timeout: Tiempo máximo de espera en segundos
        """
        try:
            element = WebDriverWait(self.driver, timeout).until(
                EC.element_to_be_clickable((by, value))
            )
            return element
        except TimeoutException:
            print(f"✗ Timeout esperando que elemento sea clickeable: {value}")
            return None
    
    def navigate_to(self, path):
        """
        Navega a una ruta específica
        
        Args:
            path: Ruta relativa (ej: "/usuarios")
        """
        url = f"{BASE_URL}{path}"
        self.driver.get(url)
        time.sleep(1)  # Pequeña pausa para que cargue
        print(f"→ Navegando a: {path}")
    
    def click_element(self, by, value):
        """
        Hace clic en un elemento de forma segura
        
        Args:
            by: Tipo de selector
            value: Valor del selector
        """
        try:
            element = self.wait_for_clickable(by, value)
            if element:
                element.click()
                return True
            return False
        except Exception as e:
            print(f"✗ Error al hacer clic en elemento: {str(e)}")
            return False
    
    def fill_input(self, by, value, text):
        """
        Llena un campo de entrada de texto
        
        Args:
            by: Tipo de selector
            value: Valor del selector
            text: Texto a ingresar
        """
        try:
            element = self.wait_for_element(by, value)
            if element:
                element.clear()
                element.send_keys(text)
                return True
            return False
        except Exception as e:
            print(f"✗ Error al llenar input: {str(e)}")
            return False
    
    def get_text(self, by, value):
        """
        Obtiene el texto de un elemento
        
        Args:
            by: Tipo de selector
            value: Valor del selector
        """
        try:
            element = self.wait_for_element(by, value)
            if element:
                return element.text
            return None
        except Exception as e:
            print(f"✗ Error al obtener texto: {str(e)}")
            return None
    
    def element_exists(self, by, value):
        """
        Verifica si un elemento existe en la página
        
        Args:
            by: Tipo de selector
            value: Valor del selector
        """
        try:
            self.driver.find_element(by, value)
            return True
        except NoSuchElementException:
            return False
    
    def wait_for_url_change(self, expected_url, timeout=10):
        """
        Espera a que la URL cambie a la esperada
        
        Args:
            expected_url: URL esperada (puede ser parcial)
            timeout: Tiempo máximo de espera
        """
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.url_contains(expected_url)
            )
            return True
        except TimeoutException:
            print(f"✗ Timeout esperando cambio de URL a: {expected_url}")
            return False


