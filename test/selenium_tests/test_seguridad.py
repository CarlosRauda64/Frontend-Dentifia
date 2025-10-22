"""
Pruebas automatizadas del Módulo de Seguridad
Cubre las historias de usuario HU-01 a HU-06
"""

import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from base_test import BaseTest


class TestModuloSeguridad(BaseTest):
    """Pruebas para el módulo de gestión de usuarios y seguridad"""
    
    def __init__(self):
        super().__init__()
        self.test_results = []
    
    def run_all_tests(self):
        """Ejecuta todas las pruebas del módulo de seguridad"""
        print("\n" + "="*70)
        print("🔐 INICIANDO PRUEBAS DEL MÓDULO DE SEGURIDAD")
        print("="*70)
        
        try:
            self.setup_driver()
            
            # HU-01: Inicio de Sesión
            self.test_hu01_login()
            
            # HU-05: Listado de Usuarios (debe ir antes de crear)
            self.test_hu05_listar_usuarios()
            
            # HU-02: Creación de usuarios
            self.test_hu02_crear_usuario()
            
            # HU-04: Edición de usuarios
            self.test_hu04_editar_usuario()
            
            # HU-06: Editar Perfil
            self.test_hu06_editar_perfil()
            
            # HU-03: Eliminación de usuario (debe ir al final)
            self.test_hu03_eliminar_usuario()
            
        finally:
            self.teardown_driver()
        
        # Mostrar resumen
        self.print_summary()
    
    def test_hu01_login(self):
        """
        HU-01: Inicio de Sesión
        Verifica que un usuario pueda iniciar sesión correctamente
        """
        print("\n📋 [HU-01] Prueba: Inicio de Sesión")
        print("-" * 70)
        
        try:
            # Realizar login
            if self.login("admin"):
                # Verificar redirección al dashboard
                if "/app" in self.driver.current_url:
                    self.take_screenshot("hu01_login_exitoso")
                    print("✅ PASÓ: Login exitoso y redirección correcta")
                    self.test_results.append(("HU-01", "Login", "PASÓ", "Login exitoso"))
                else:
                    raise Exception("No se redirigió correctamente al dashboard")
            else:
                raise Exception("Error en el proceso de login")
                
        except Exception as e:
            print(f"❌ FALLÓ: {str(e)}")
            self.take_screenshot("hu01_login_error")
            self.test_results.append(("HU-01", "Login", "FALLÓ", str(e)))
    
    def test_hu02_crear_usuario(self):
        """
        HU-02: Creación de usuarios
        Verifica que se pueda crear un nuevo usuario
        """
        print("\n📋 [HU-02] Prueba: Creación de usuarios")
        print("-" * 70)
        
        try:
            # Navegar a la página de creación de usuario
            self.navigate_to("/usuarios/nuevo")
            time.sleep(1)
            
            # Verificar que estamos en la página correcta
            if not self.element_exists(By.ID, "user"):
                raise Exception("No se encontró el formulario de creación")
            
            # Generar datos únicos para el usuario
            timestamp = int(time.time())
            test_usuario = f"test_user_{timestamp}"
            
            # Llenar el formulario
            self.fill_input(By.ID, "user", test_usuario)
            self.fill_input(By.ID, "password", "password123")
            self.fill_input(By.ID, "email", f"{test_usuario}@test.com")
            self.fill_input(By.ID, "name", "Usuario")
            self.fill_input(By.ID, "apellido", "Prueba")
            
            # Seleccionar rol
            rol_select = Select(self.driver.find_element(By.ID, "rol"))
            rol_select.select_by_visible_text("secretaria")
            
            # Tomar screenshot del formulario lleno
            self.take_screenshot("hu02_formulario_crear_usuario")
            
            # Hacer clic en el botón Agregar
            submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            submit_button.click()
            
            # Esperar redirección
            time.sleep(2)
            
            # Verificar que se redirigió al listado
            if "/usuarios" in self.driver.current_url and "/nuevo" not in self.driver.current_url:
                self.take_screenshot("hu02_usuario_creado")
                print(f"✅ PASÓ: Usuario '{test_usuario}' creado exitosamente")
                self.test_results.append(("HU-02", "Crear Usuario", "PASÓ", f"Usuario {test_usuario} creado"))
            else:
                raise Exception("No se redirigió correctamente después de crear")
                
        except Exception as e:
            print(f"❌ FALLÓ: {str(e)}")
            self.take_screenshot("hu02_crear_usuario_error")
            self.test_results.append(("HU-02", "Crear Usuario", "FALLÓ", str(e)))
    
    def test_hu03_eliminar_usuario(self):
        """
        HU-03: Eliminación de usuario
        Verifica que se pueda eliminar un usuario
        """
        print("\n📋 [HU-03] Prueba: Eliminación de usuario")
        print("-" * 70)
        
        try:
            # Navegar al listado de usuarios
            self.navigate_to("/usuarios")
            time.sleep(2)
            
            # Buscar íconos de eliminar (SVG dentro de TableCell)
            delete_buttons = self.driver.find_elements(By.CSS_SELECTOR, "svg.cursor-pointer")
            
            # Filtrar solo los de eliminar (segundo en cada fila)
            delete_buttons = [btn for i, btn in enumerate(delete_buttons) if i % 2 != 0]
            
            if len(delete_buttons) > 0:
                # Hacer clic en el botón de eliminar del último usuario
                self.take_screenshot("hu03_antes_eliminar")
                delete_buttons[-1].click()
                time.sleep(1)
                
                # Buscar y confirmar en el modal
                accept_button = self.wait_for_element(By.XPATH, "//button[contains(text(), 'Aceptar') or contains(text(), 'Confirmar') or contains(text(), 'Sí')]")
                
                if accept_button:
                    self.take_screenshot("hu03_modal_confirmacion")
                    accept_button.click()
                    time.sleep(2)
                    
                    self.take_screenshot("hu03_usuario_eliminado")
                    print("✅ PASÓ: Usuario eliminado exitosamente")
                    self.test_results.append(("HU-03", "Eliminar Usuario", "PASÓ", "Usuario eliminado correctamente"))
                else:
                    raise Exception("No se encontró el botón de confirmación")
            else:
                raise Exception("No se encontraron usuarios para eliminar")
                
        except Exception as e:
            print(f"❌ FALLÓ: {str(e)}")
            self.take_screenshot("hu03_eliminar_usuario_error")
            self.test_results.append(("HU-03", "Eliminar Usuario", "FALLÓ", str(e)))
    
    def test_hu04_editar_usuario(self):
        """
        HU-04: Edición de usuarios
        Verifica que se pueda editar un usuario existente
        """
        print("\n📋 [HU-04] Prueba: Edición de usuarios")
        print("-" * 70)
        
        try:
            # Navegar al listado de usuarios
            self.navigate_to("/usuarios")
            time.sleep(2)
            
            # Buscar íconos de editar (SVG dentro de TableCell)
            edit_buttons = self.driver.find_elements(By.CSS_SELECTOR, "svg.cursor-pointer")
            
            # Filtrar solo los de editar (primero en cada fila)
            edit_buttons = [btn for i, btn in enumerate(edit_buttons) if i % 2 == 0]
            
            if len(edit_buttons) > 0:
                # Hacer clic en el primer botón de editar
                self.take_screenshot("hu04_antes_editar")
                edit_buttons[0].click()
                time.sleep(2)
                
                # Verificar que estamos en la página de edición
                if "/usuarios/editar/" in self.driver.current_url:
                    # Modificar el nombre
                    nombre_input = self.wait_for_element(By.ID, "name")
                    if nombre_input:
                        nombre_input.clear()
                        nombre_input.send_keys("Usuario Editado")
                        
                        self.take_screenshot("hu04_formulario_editado")
                        
                        # Hacer clic en guardar
                        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
                        submit_button.click()
                        time.sleep(2)
                        
                        # Verificar redirección
                        if "/usuarios" in self.driver.current_url and "/editar/" not in self.driver.current_url:
                            self.take_screenshot("hu04_usuario_editado")
                            print("✅ PASÓ: Usuario editado exitosamente")
                            self.test_results.append(("HU-04", "Editar Usuario", "PASÓ", "Usuario editado correctamente"))
                        else:
                            raise Exception("No se redirigió correctamente")
                    else:
                        raise Exception("No se encontró el campo de nombre")
                else:
                    raise Exception("No se navegó a la página de edición")
            else:
                raise Exception("No se encontraron usuarios para editar")
                
        except Exception as e:
            print(f"❌ FALLÓ: {str(e)}")
            self.take_screenshot("hu04_editar_usuario_error")
            self.test_results.append(("HU-04", "Editar Usuario", "FALLÓ", str(e)))
    
    def test_hu05_listar_usuarios(self):
        """
        HU-05: Listado de Usuarios
        Verifica que se pueda visualizar el listado de usuarios
        """
        print("\n📋 [HU-05] Prueba: Listado de Usuarios")
        print("-" * 70)
        
        try:
            # Navegar al listado de usuarios
            self.navigate_to("/usuarios")
            time.sleep(2)
            
            # Verificar que existe el título
            titulo = self.get_text(By.XPATH, "//h1[contains(text(), 'Lista de Usuarios')]")
            
            if titulo:
                # Verificar que existe una tabla o listado
                tabla_existe = self.element_exists(By.TAG_NAME, "table") or \
                              self.element_exists(By.CSS_SELECTOR, "[class*='table']")
                
                if tabla_existe:
                    self.take_screenshot("hu05_listado_usuarios")
                    print("✅ PASÓ: Listado de usuarios mostrado correctamente")
                    self.test_results.append(("HU-05", "Listar Usuarios", "PASÓ", "Listado visible con tabla"))
                else:
                    raise Exception("No se encontró la tabla de usuarios")
            else:
                raise Exception("No se encontró el título del listado")
                
        except Exception as e:
            print(f"❌ FALLÓ: {str(e)}")
            self.take_screenshot("hu05_listar_usuarios_error")
            self.test_results.append(("HU-05", "Listar Usuarios", "FALLÓ", str(e)))
    
    def test_hu06_editar_perfil(self):
        """
        HU-06: Editar Perfil
        Verifica que un usuario pueda editar su propio perfil
        """
        print("\n📋 [HU-06] Prueba: Editar Perfil")
        print("-" * 70)
        
        try:
            # Navegar a la configuración de usuario
            self.navigate_to("/usuarios/configuracion")
            time.sleep(2)
            
            # Verificar que estamos en la página correcta
            if self.element_exists(By.XPATH, "//h1[contains(text(), 'Configuración') or contains(text(), 'Perfil')]"):
                self.take_screenshot("hu06_ver_perfil")
                
                # Buscar el botón de editar
                editar_buttons = self.driver.find_elements(By.XPATH, "//button[contains(text(), 'Editar')] | //a[contains(text(), 'Editar')]")
                
                if len(editar_buttons) > 0:
                    editar_buttons[0].click()
                    time.sleep(1)
                    
                    # Modificar el nombre
                    nombre_input = self.wait_for_element(By.ID, "name")
                    if nombre_input:
                        nombre_input.clear()
                        nombre_input.send_keys("Perfil Actualizado")
                        
                        self.take_screenshot("hu06_editar_perfil")
                        
                        # Guardar cambios
                        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
                        submit_button.click()
                        time.sleep(2)
                        
                        self.take_screenshot("hu06_perfil_editado")
                        print("✅ PASÓ: Perfil editado exitosamente")
                        self.test_results.append(("HU-06", "Editar Perfil", "PASÓ", "Perfil actualizado correctamente"))
                    else:
                        raise Exception("No se encontró el campo de nombre en el formulario")
                else:
                    # Si no hay botón de editar, intentar editar directamente
                    nombre_input = self.driver.find_element(By.ID, "name")
                    if nombre_input and nombre_input.is_enabled():
                        nombre_input.clear()
                        nombre_input.send_keys("Perfil Actualizado")
                        
                        self.take_screenshot("hu06_editar_perfil")
                        
                        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
                        submit_button.click()
                        time.sleep(2)
                        
                        self.take_screenshot("hu06_perfil_editado")
                        print("✅ PASÓ: Perfil editado exitosamente")
                        self.test_results.append(("HU-06", "Editar Perfil", "PASÓ", "Perfil actualizado correctamente"))
                    else:
                        raise Exception("No se pudo editar el perfil")
            else:
                raise Exception("No se encontró la página de configuración")
                
        except Exception as e:
            print(f"❌ FALLÓ: {str(e)}")
            self.take_screenshot("hu06_editar_perfil_error")
            self.test_results.append(("HU-06", "Editar Perfil", "FALLÓ", str(e)))
    
    def print_summary(self):
        """Imprime un resumen de los resultados de las pruebas"""
        print("\n" + "="*70)
        print("📊 RESUMEN DE PRUEBAS - MÓDULO DE SEGURIDAD")
        print("="*70)
        
        passed = sum(1 for result in self.test_results if result[2] == "PASÓ")
        failed = sum(1 for result in self.test_results if result[2] == "FALLÓ")
        total = len(self.test_results)
        
        for result in self.test_results:
            status_icon = "✅" if result[2] == "PASÓ" else "❌"
            print(f"{status_icon} [{result[0]}] {result[1]}: {result[2]}")
            if result[3]:
                print(f"   └─ {result[3]}")
        
        print(f"\n📈 Total: {total} pruebas | ✅ Pasaron: {passed} | ❌ Fallaron: {failed}")
        print(f"📊 Tasa de éxito: {(passed/total*100):.1f}%")
        print("="*70 + "\n")


if __name__ == "__main__":
    test_suite = TestModuloSeguridad()
    test_suite.run_all_tests()

