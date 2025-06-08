import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { HiUser } from "react-icons/hi";
import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router";
import {useEffect, useState} from "react";

const Navegacion = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState('');

  useEffect(() => {
    setUser(auth.getUser());
  }, []);

  const handleLogout = () => {
    auth.signout();
    navigate("/login", { replace: true });
  };

  return (
    <Navbar fluid className="rounded-b-sm">
      <NavbarBrand href="https://flowbite-react.com">
        <img src="https://flowbite-react.com/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite React</span>
      </NavbarBrand>
      <div className="flex md:order-2 gap-4">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="Configuracion de usuario" icon={<HiUser />} className="cursor-pointer" rounded />	
          }
        >
          <DropdownHeader>
            <span className="block text-sm">{user?.nombre} {user?.apellido}</span>
            <span className="block truncate text-sm font-medium">{
              user.rol=='doctor' ? 'Doctor' : user.rol
            }</span>
          </DropdownHeader>
          <DropdownItem>Dashboard</DropdownItem>
          <DropdownItem>Settings</DropdownItem>
          <DropdownItem>Earnings</DropdownItem>
          <DropdownDivider />
          <DropdownItem onClick={handleLogout}>Cerrar Sesión</DropdownItem>
        </Dropdown>
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink href="#" >
          Home
        </NavbarLink>
        {
          user.rol === 'administrador' && (
            <NavbarLink href="/app/usuarios">Usuarios</NavbarLink>
          )
        }
        <NavbarLink href="#">Services</NavbarLink>
        <NavbarLink href="#">Pricing</NavbarLink>
        <NavbarLink href="#">Contact</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  )
}

export default Navegacion