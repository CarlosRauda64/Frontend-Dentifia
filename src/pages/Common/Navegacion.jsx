import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router";
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  SidebarLogo,
  Button,
  ToggleSwitch,
} from "flowbite-react";
import {
  HiUser,
  HiOutlineArrowCircleRight,
  HiOutlineArrowCircleLeft,
  HiCalendar,
  HiClipboard,
  HiCurrencyDollar,
  HiClipboardCheck,
  HiClipboardList,
  HiDocumentReport,
  HiUsers,
  HiOutlineLogout,
  HiPuzzle,
  HiMoon,
  HiSun,
  HiIdentification
} from "react-icons/hi";

const Navegacion = ({ children }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [visible, setVisible] = useState(true)
  const [theme, setTheme] = useState(localStorage.getItem('theme') === 'dark' ? true : false);

  const handleLogout = () => {
    auth.signout();
    navigate("/login", { replace: true });
  };

  const toggleVisible = () => {
    visible ? setVisible(false) : setVisible(true)
    console.log(visible)
  }

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme(true);
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme(false);
    }
  }, [theme]);

  useEffect(() => {
    setUser(auth.getUser());
  }, []);

  return (
    <React.Fragment>
      <div className="max-sm:relative sm:flex flex-row">
        <Sidebar className={`${visible ? "max-sm:-translate-x-[100%]" : ""} transition delay-150 duration-300 ease-in-out max-sm:fixed sm:sticky top-0 h-screen z-10`}>
          <Button className="sm:hidden absolute left-67 bg-white dark:bg-gray-800 shadow-md z-10 p-2" onClick={() => toggleVisible()}>
            {visible ? <HiOutlineArrowCircleRight size={32} className="text-black dark:text-white" /> : <HiOutlineArrowCircleLeft size={32} className="text-black dark:text-white" />}
          </Button>
          <SidebarItems className="flex flex-col items-between justify-between h-full">
            <SidebarItemGroup>
              <SidebarLogo href="/app" img="https://tinyurl.com/y6dvz8jy" imgAlt="DentiFia Logo">
                DentiFia
              </SidebarLogo>
              {
                user.rol == "administrador" &&
                <SidebarItem href="/usuarios" icon={HiUsers}>
                  Gestión de Usuarios
                </SidebarItem>
              }
              {
                (user.rol == "secretaria" || user.rol == "administrador") &&
                <SidebarItem href="/citas" icon={HiCalendar}>
                  Agendación de Citas
                </SidebarItem>
              }
              {
                (user.rol == "secretaria" || user.rol == "doctor" || user.rol == "administrador") &&
                <SidebarItem href="/pacientes" icon={HiIdentification}>
                  Gestión de Pacientes
                </SidebarItem>
              }
              {
                (user.rol == "doctor" || user.rol == "administrador") &&
                <SidebarItem href="/expedientes" icon={HiClipboard}>
                  Expedientes
                </SidebarItem>
              }
              {
                (user.rol == "secretaria" || user.rol == "administrador") &&
                <SidebarItem href="/factura" icon={HiCurrencyDollar}>
                  Facturación
                </SidebarItem>
              }
              <SidebarItem href="/inventario" icon={HiClipboardList}>
                Inventario
              </SidebarItem>
              {
                (user.rol == "secretaria" || user.rol == "administrador") &&
                <SidebarItem href="/encuestas" icon={HiClipboardCheck}>
                  Encuestas
                </SidebarItem>
              }
              <SidebarItem href="/reportes" icon={HiDocumentReport}>
                Reportes
              </SidebarItem>
              <SidebarItem icon={!theme ? HiSun : HiMoon} className="flex items-center">
                <ToggleSwitch checked={theme} onChange={setTheme} label="Modo Oscuro" />
              </SidebarItem>
            </SidebarItemGroup>
            <SidebarItemGroup>
              <SidebarItem href="/usuarios/configuracion" icon={HiUser}>
                {user.nombre}
                <br />
                {user.apellido}
              </SidebarItem>
              <SidebarItem icon={HiPuzzle}>
                {user.rol}
              </SidebarItem>
              <SidebarItem icon={HiOutlineLogout} onClick={() => handleLogout()} className="cursor-pointer">
                Cerrar Sesion
              </SidebarItem>
            </SidebarItemGroup>
          </SidebarItems>
        </Sidebar>
        <div className={`${visible ? "hidden" : "sm:hidden"} bg-black opacity-[50%] w-full h-full fixed z-1`} onClick={() => toggleVisible()}></div>
        <div className="shrink w-full max-sm:absolute max-sm:min-h-screen dark:bg-gray-900 bg-gray-100">
          {children}
        </div>
      </div>
    </React.Fragment>
  )
}

export default Navegacion