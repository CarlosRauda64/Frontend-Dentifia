import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
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
  HiClipboardList,
  HiDocumentReport,
  HiUsers,
  HiOutlineLogout,
  HiPuzzle,
  HiMoon,
  HiSun
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
    <>
      <div className="max-sm:relative sm:flex flex-row">
        <Sidebar className={`${visible ? "max-sm:-translate-x-[100%]" : ""} transition delay-150 duration-300 ease-in-out max-sm:fixed sm:sticky top-0 h-screen z-10`}>
          <Button className="sm:hidden absolute left-67 bg-white dark:bg-gray-800 shadow-md z-10 p-2" onClick={() => toggleVisible()}>
            {visible ? <HiOutlineArrowCircleRight size={32} className="text-black dark:text-white"/> : <HiOutlineArrowCircleLeft size={32} className="text-black dark:text-white"/>}
          </Button>
          <SidebarItems className="flex flex-col items-between justify-between h-full">
            <SidebarItemGroup>
              <SidebarLogo href="#" img="https://tinyurl.com/y6dvz8jy" imgAlt="DentiFia Logo">
                DentiFia
              </SidebarLogo>
              {
                user.rol == "administrador" &&
                <SidebarItem href="/usuarios" icon={HiUsers}>
                  Gestión de Usuarios
                </SidebarItem>
              }
              <SidebarItem href="#" icon={HiCalendar}>
                Agendación de Citas
              </SidebarItem>
              <SidebarItem href="#" icon={HiClipboard}>
                Diagnóstico
              </SidebarItem>
              <SidebarItem href="/factura" icon={HiCurrencyDollar}>
                Facturación
              </SidebarItem>
              <SidebarItem href="/inventario" icon={HiClipboardList}>
                Inventario
              </SidebarItem>
              <SidebarItem href="#" icon={HiDocumentReport}>
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
        <div className="shrink w-full max-sm:absolute max-sm:inset-0 max-sm:h-screen dark:bg-gray-900 bg-gray-100">
          {children}
        </div>
      </div>
    </>
  )
}

export default Navegacion