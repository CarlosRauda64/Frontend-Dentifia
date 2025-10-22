"""
Script principal para ejecutar todas las pruebas de Selenium
Genera un reporte consolidado de todas las pruebas
"""

import sys
import os
import json
from datetime import datetime
from test_seguridad import TestModuloSeguridad
from test_inventario import TestModuloInventario
from test_facturacion import TestModuloFacturacion


class TestRunner:
    """Ejecutor y generador de reportes para todas las pruebas"""
    
    def __init__(self):
        self.all_results = []
        self.start_time = None
        self.end_time = None
    
    def run_all_tests(self):
        """Ejecuta todas las suites de pruebas"""
        print("\n" + "="*70)
        print("🚀 INICIANDO SUITE COMPLETA DE PRUEBAS - DENTIFIA")
        print("="*70)
        print(f"⏰ Fecha y hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*70)
        
        self.start_time = datetime.now()
        
        # 1. Módulo de Seguridad (HU-01 a HU-06)
        print("\n🔐 MÓDULO 1: SEGURIDAD")
        test_seguridad = TestModuloSeguridad()
        test_seguridad.run_all_tests()
        self.all_results.extend(test_seguridad.test_results)
        
        # 2. Módulo de Inventario (HU-07 a HU-14)
        print("\n📦 MÓDULO 2: INVENTARIO")
        test_inventario = TestModuloInventario()
        test_inventario.run_all_tests()
        self.all_results.extend(test_inventario.test_results)
        
        # 3. Módulo de Facturación (HU-15 a HU-18)
        print("\n💰 MÓDULO 3: FACTURACIÓN")
        test_facturacion = TestModuloFacturacion()
        test_facturacion.run_all_tests()
        self.all_results.extend(test_facturacion.test_results)
        
        self.end_time = datetime.now()
        
        # Generar reportes
        self.print_final_summary()
        self.generate_json_report()
        self.generate_markdown_report()
    
    def print_final_summary(self):
        """Imprime un resumen final consolidado"""
        print("\n" + "="*70)
        print("📊 RESUMEN FINAL - TODAS LAS PRUEBAS")
        print("="*70)
        
        # Estadísticas generales
        total = len(self.all_results)
        passed = sum(1 for result in self.all_results if result[2] == "PASÓ")
        failed = sum(1 for result in self.all_results if result[2] == "FALLÓ")
        success_rate = (passed/total*100) if total > 0 else 0
        
        # Estadísticas por módulo
        modulos = {
            "Seguridad": [r for r in self.all_results if r[0].startswith("HU-0") and int(r[0].split("-")[1]) <= 6],
            "Inventario": [r for r in self.all_results if r[0].startswith("HU-") and 7 <= int(r[0].split("-")[1]) <= 14],
            "Facturación": [r for r in self.all_results if r[0].startswith("HU-") and 15 <= int(r[0].split("-")[1]) <= 18]
        }
        
        print(f"\n⏱️  Tiempo total de ejecución: {self.end_time - self.start_time}")
        print(f"\n📈 ESTADÍSTICAS GENERALES:")
        print(f"   • Total de pruebas: {total}")
        print(f"   • ✅ Pasaron: {passed}")
        print(f"   • ❌ Fallaron: {failed}")
        print(f"   • 📊 Tasa de éxito: {success_rate:.1f}%")
        
        print(f"\n📋 RESULTADOS POR MÓDULO:")
        for modulo_name, resultados in modulos.items():
            if resultados:
                mod_passed = sum(1 for r in resultados if r[2] == "PASÓ")
                mod_total = len(resultados)
                mod_rate = (mod_passed/mod_total*100) if mod_total > 0 else 0
                print(f"\n   {modulo_name}:")
                print(f"   └─ {mod_passed}/{mod_total} pruebas pasadas ({mod_rate:.1f}%)")
        
        print(f"\n📝 DETALLE DE TODAS LAS PRUEBAS:")
        for result in self.all_results:
            status_icon = "✅" if result[2] == "PASÓ" else "❌"
            print(f"\n{status_icon} [{result[0]}] {result[1]}: {result[2]}")
            if result[3]:
                print(f"   └─ {result[3]}")
        
        print("\n" + "="*70)
        
        # Mensaje final
        if success_rate == 100:
            print("🎉 ¡EXCELENTE! Todas las pruebas pasaron exitosamente")
        elif success_rate >= 80:
            print("✅ BUENO: La mayoría de las pruebas pasaron")
        elif success_rate >= 50:
            print("⚠️  ADVERTENCIA: Algunas pruebas fallaron")
        else:
            print("❌ ERROR: Muchas pruebas fallaron, revisar implementación")
        
        print("="*70 + "\n")
    
    def generate_json_report(self):
        """Genera un reporte en formato JSON"""
        report_data = {
            "fecha_ejecucion": self.start_time.strftime('%Y-%m-%d %H:%M:%S'),
            "duracion_segundos": (self.end_time - self.start_time).total_seconds(),
            "estadisticas": {
                "total": len(self.all_results),
                "pasadas": sum(1 for r in self.all_results if r[2] == "PASÓ"),
                "falladas": sum(1 for r in self.all_results if r[2] == "FALLÓ"),
                "tasa_exito": (sum(1 for r in self.all_results if r[2] == "PASÓ") / len(self.all_results) * 100) if self.all_results else 0
            },
            "resultados": [
                {
                    "historia_usuario": result[0],
                    "nombre": result[1],
                    "estado": result[2],
                    "detalle": result[3]
                }
                for result in self.all_results
            ]
        }
        
        # Guardar JSON
        report_path = os.path.join("test/selenium_tests/reports", 
                                   f"reporte_{self.start_time.strftime('%Y%m%d_%H%M%S')}.json")
        
        os.makedirs(os.path.dirname(report_path), exist_ok=True)
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)
        
        print(f"📄 Reporte JSON generado: {report_path}")
    
    def generate_markdown_report(self):
        """Genera un reporte en formato Markdown"""
        timestamp = self.start_time.strftime('%Y%m%d_%H%M%S')
        report_path = os.path.join("test/selenium_tests/reports", 
                                   f"reporte_{timestamp}.md")
        
        os.makedirs(os.path.dirname(report_path), exist_ok=True)
        
        # Calcular estadísticas
        total = len(self.all_results)
        passed = sum(1 for r in self.all_results if r[2] == "PASÓ")
        failed = sum(1 for r in self.all_results if r[2] == "FALLÓ")
        success_rate = (passed/total*100) if total > 0 else 0
        
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write("# Reporte de Pruebas Automatizadas - DentiFIA\n\n")
            f.write(f"**Fecha de ejecución:** {self.start_time.strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write(f"**Duración:** {self.end_time - self.start_time}\n\n")
            f.write("---\n\n")
            
            f.write("## Resumen Ejecutivo\n\n")
            f.write(f"- **Total de pruebas:** {total}\n")
            f.write(f"- **✅ Pasadas:** {passed}\n")
            f.write(f"- **❌ Falladas:** {failed}\n")
            f.write(f"- **📊 Tasa de éxito:** {success_rate:.1f}%\n\n")
            
            f.write("---\n\n")
            
            # Resultados por módulo
            f.write("## Resultados por Módulo\n\n")
            
            modulos = {
                "Seguridad (HU-01 a HU-06)": [r for r in self.all_results if r[0].startswith("HU-0") and int(r[0].split("-")[1]) <= 6],
                "Inventario (HU-07 a HU-14)": [r for r in self.all_results if r[0].startswith("HU-") and 7 <= int(r[0].split("-")[1]) <= 14],
                "Facturación (HU-15 a HU-18)": [r for r in self.all_results if r[0].startswith("HU-") and 15 <= int(r[0].split("-")[1]) <= 18]
            }
            
            for modulo_name, resultados in modulos.items():
                if resultados:
                    f.write(f"### {modulo_name}\n\n")
                    
                    mod_passed = sum(1 for r in resultados if r[2] == "PASÓ")
                    mod_total = len(resultados)
                    mod_rate = (mod_passed/mod_total*100) if mod_total > 0 else 0
                    
                    f.write(f"**Resultado:** {mod_passed}/{mod_total} pruebas pasadas ({mod_rate:.1f}%)\n\n")
                    
                    f.write("| HU | Prueba | Estado | Detalle |\n")
                    f.write("|---|---|---|---|\n")
                    
                    for result in resultados:
                        status_icon = "✅" if result[2] == "PASÓ" else "❌"
                        f.write(f"| {result[0]} | {result[1]} | {status_icon} {result[2]} | {result[3]} |\n")
                    
                    f.write("\n")
            
            f.write("---\n\n")
            f.write("## Conclusiones\n\n")
            
            if success_rate == 100:
                f.write("🎉 **EXCELENTE:** Todas las pruebas pasaron exitosamente. El sistema cumple con todos los requerimientos probados.\n\n")
            elif success_rate >= 80:
                f.write("✅ **BUENO:** La mayoría de las pruebas pasaron. Hay algunas áreas que requieren atención.\n\n")
            elif success_rate >= 50:
                f.write("⚠️ **ADVERTENCIA:** Varias pruebas fallaron. Se requiere revisión del sistema.\n\n")
            else:
                f.write("❌ **ERROR CRÍTICO:** Muchas pruebas fallaron. Se requiere revisión inmediata.\n\n")
            
            f.write("## Recomendaciones\n\n")
            
            if failed > 0:
                f.write("- Revisar las pruebas que fallaron en detalle\n")
                f.write("- Verificar que el backend y frontend estén corriendo correctamente\n")
                f.write("- Comprobar que existan datos de prueba necesarios en la base de datos\n")
                f.write("- Analizar los screenshots generados en la carpeta `screenshots/`\n")
            else:
                f.write("- El sistema está funcionando correctamente según las pruebas realizadas\n")
                f.write("- Se recomienda ejecutar las pruebas periódicamente para garantizar estabilidad\n")
            
            f.write("\n---\n\n")
            f.write(f"*Reporte generado automáticamente por Selenium el {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n")
        
        print(f"📄 Reporte Markdown generado: {report_path}")


if __name__ == "__main__":
    print("="*70)
    print("   SUITE DE PRUEBAS AUTOMATIZADAS - SISTEMA DENTIFIA")
    print("="*70)
    print("   Herramienta: Selenium WebDriver con Python")
    print("   Módulos: Seguridad, Inventario, Facturación")
    print("   Total HU a probar: 18 historias de usuario")
    print("="*70 + "\n")
    
    runner = TestRunner()
    runner.run_all_tests()
    
    print("\n✅ Ejecución completada. Revisar reportes en la carpeta 'reports/'")
    print("📸 Screenshots disponibles en la carpeta 'screenshots/'\n")


