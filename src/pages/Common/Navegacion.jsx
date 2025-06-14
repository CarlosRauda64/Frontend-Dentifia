import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  SidebarLogo,
  Button
} from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
  HiOutlineViewList,
  HiArrowNarrowRight,
  HiArrowNarrowLeft
} from "react-icons/hi";

const Navegacion = ({ children }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [visible, setVisible] = useState(true)

  const handleLogout = () => {
    auth.signout();
    navigate("/login", { replace: true });
  };

  const toggleVisible = () => {
    visible ? setVisible(false) : setVisible(true)
    console.log(visible)
  }

  useEffect(() => {
    setUser(auth.getUser());
  }, []);

  return (
    <>
      <div className="max-sm:relative sm:flex flex-row">
        <Sidebar className={`${visible ? "max-sm:-translate-x-[100%]" : ""} transition delay-150 duration-300 ease-in-out max-sm:fixed sm:sticky top-0 h-screen z-10`}>
          <Button className="sm:hidden absolute left-68 bg-white dark:bg-gray-800 shadow-md z-10" onClick={() => toggleVisible()}>
            {visible ? <HiArrowNarrowRight className="w-8 h-8" /> : <HiArrowNarrowLeft className="w-8 h-8" />}
          </Button>
          <SidebarItems className="flex flex-col items-between justify-between h-full">
            <SidebarItemGroup>
              <SidebarLogo href="#" img="https://tinyurl.com/y6dvz8jy" imgAlt="DentiFia Logo">
                DentiFia
              </SidebarLogo>
              <SidebarItem href="#" icon={HiChartPie}>
                Dashboard
              </SidebarItem>
              <SidebarItem href="#" icon={HiViewBoards}>
                Kanban
              </SidebarItem>
              <SidebarItem href="#" icon={HiInbox}>
                Inbox
              </SidebarItem>
              <SidebarItem href="#" icon={HiShoppingBag}>
                Products
              </SidebarItem>
              {
                user.rol == "administrador" &&
                <SidebarItem href="#" icon={HiShoppingBag}>
                  Crear Usuarios
                </SidebarItem>
              }
            </SidebarItemGroup>
            <SidebarItemGroup>
              <SidebarLogo img="https://tinyurl.com/y6dvz8jy" imgAlt="DentiFia Logo">
                {user.nombre}
                <br />
                {user.apellido}
              </SidebarLogo>
              <SidebarItem href="#" icon={HiUser}>
                {user.rol}
              </SidebarItem>
              <SidebarItem icon={HiTable} onClick={() => handleLogout()} className="cursor-pointer">
                Cerrar Sesion
              </SidebarItem>
            </SidebarItemGroup>
          </SidebarItems>
        </Sidebar>
        <div className={`${visible ? "hidden" : "sm:hidden"} bg-black opacity-[50%] w-full h-full fixed z-1`} onClick={() => toggleVisible()}></div>
        <div className="shrink w-full max-sm:absolute max-sm:top-0">
          {children}
        </div>
      </div>
    </>
  )
}

export default Navegacion