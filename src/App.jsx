
import { useEffect, useState } from 'react'
import { Card } from 'flowbite-react'
import {
  HiUserGroup,
  HiCalendar,
  HiClipboardCheck,
  HiCurrencyDollar,
  HiArchive,
  HiDocumentReport,
  HiShieldCheck
} from 'react-icons/hi'
import Navegacion from './pages/Common/Navegacion.jsx'
import { useAuth } from './auth/useAuth';

const App = () => {

  const auth = useAuth();
  const [user, setUser] = useState('');

  const moduleAccess = {
    administrador: ['Gestión de Usuarios', 'Agendación de Citas', 'Diagnóstico', 'Facturación', 'Inventario', 'Reportes'],
    secretaria: ['Agendación de Citas', 'Facturación', 'Inventario', 'Reportes'],
    doctor: ['Diagnóstico', 'Inventario', 'Reportes'],
  };

  const modules = [
    {
      icon: <HiUserGroup className="h-8 w-8 text-blue-600" />,
      title: 'Gestión de Usuarios',
      description: 'Administra los usuarios del sistema: crea, edita o elimina personal autorizado.',
    },
    {
      icon: <HiCalendar className="h-8 w-8 text-green-600" />,
      title: 'Agendación de Citas',
      description: 'Programa y gestiona las citas con tus pacientes fácilmente.',
    },
    {
      icon: <HiClipboardCheck className="h-8 w-8 text-purple-600" />,
      title: 'Diagnóstico',
      description: 'Accede y actualiza los expedientes clínicos, odontogramas y tratamientos.',
    },
    {
      icon: <HiCurrencyDollar className="h-8 w-8 text-yellow-500" />,
      title: 'Facturación',
      description: 'Emite y consulta facturas con detalle de servicios y pagos.',
    },
    {
      icon: <HiArchive className="h-8 w-8 text-red-500" />,
      title: 'Inventario',
      description: 'Gestiona los insumos disponibles y controla entradas y salidas.',
    },
    {
      icon: <HiDocumentReport className="h-8 w-8 text-pink-600" />,
      title: 'Reportes',
      description: 'Genera informes relevantes para control de procesos y decisiones.',
    },
  ];

  useEffect(() => {
    setUser(auth.getUser());
  }, [auth]);

  return (
    <>
      <Navegacion>
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            Bienvenido a DentiFIA 🦷
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Selecciona una opción en el menú para comenzar. Estos son los módulos disponibles en el sistema:
          </p>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {modules
              .filter(mod => moduleAccess[user?.rol]?.includes(mod.title))
              .map((mod, index) => (
                <Card key={index} className="hover:shadow-lg transition">
                  {mod.icon}
                  <h5 className="text-xl font-semibold text-gray-900 dark:text-white">{mod.title}</h5>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{mod.description}</p>
                </Card>
              ))}
          </div>
        </div>
      </Navegacion>
    </>
  )
}

export default App