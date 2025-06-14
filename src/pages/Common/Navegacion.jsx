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
  HiOutlineViewList
} from "react-icons/hi";

const Navegacion = ({ children }) => {
  /* const auth = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState('');

  useEffect(() => {
    setUser(auth.getUser());
  }, []);

  const handleLogout = () => {
    auth.signout();
    navigate("/login", { replace: true });
  }; */

  const [visible, setVisible] = useState(true)

  const toggleVisible = () => {
    visible ? setVisible(false) : setVisible(true)
    console.log(visible)
  }


  return (
    <>
      <div className="max-sm:relative sm:flex flex-row">
        <Sidebar className={`${visible ? "max-sm:-translate-x-[100%]" : ""} transition delay-150 duration-300 ease-in-out max-sm:fixed sm:sticky top-0 h-screen z-10`}>
          <Button className="sm:hidden absolute left-68 bg-white dark:bg-gray-800 shadow-md z-10" onClick={() => toggleVisible()}>
            <HiOutlineViewList />
          </Button>
          <SidebarLogo href="#" img="/favicon.svg" imgAlt="Flowbite logo">
            Flowbite
          </SidebarLogo>
          <SidebarItems>
            <SidebarItemGroup>
              <SidebarItem href="#" icon={HiChartPie}>
                Dashboard
              </SidebarItem>
              <SidebarItem href="#" icon={HiViewBoards}>
                Kanban
              </SidebarItem>
              <SidebarItem href="#" icon={HiInbox}>
                Inbox
              </SidebarItem>
              <SidebarItem href="#" icon={HiUser}>
                Users
              </SidebarItem>
              <SidebarItem href="#" icon={HiShoppingBag}>
                Products
              </SidebarItem>
              <SidebarItem href="#" icon={HiArrowSmRight}>
                Sign In
              </SidebarItem>
              <SidebarItem href="#" icon={HiTable}>
                Sign Up
              </SidebarItem>
            </SidebarItemGroup>
          </SidebarItems>
        </Sidebar>
        <div className="shrink w-full max-sm:absolute max-sm:top-0">
            {children}
          </div>
      </div>
    </>
  )
}

export default Navegacion