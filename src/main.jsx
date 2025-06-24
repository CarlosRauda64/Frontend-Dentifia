import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login/Login.jsx'
import Loading from './pages/Common/Loading.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import CrearFactura from './pages/factura/CrearFactura.jsx'
import CancelarFactura from './pages/factura/CancelarFactura.jsx'
import EditarFactura from './pages/factura/EditarFactura.jsx'
import HistorialFactura from './pages/factura/HistorialFactura.jsx'
import FacturacionHome from './pages/factura/FacturacionHome.jsx';
import AuthProvider from './auth/AuthProvider.jsx'
import ListarUsuarios from './pages/Usuarios/ListarUsuarios.jsx'
import FormCrearUsuario from './pages/Usuarios/FormCrear.jsx'
import FormEditarUsuario from './pages/Usuarios/FormEditar.jsx'
import ConfigUsuario from './pages/Usuarios/ConfigUsuario.jsx'
import MenuInventario from './pages/Inventario/MenuInventario.jsx'
import ListarInsumos from './pages/Insumos/ListarInsumos.jsx'
import FormCrearInsumo from './pages/Insumos/FormCrearInsumo.jsx'
import FormEditarInsumo from './pages/Insumos/FormEditarInsumo.jsx'
import ListarMovimientosStock from './pages/Movimientos_Stock/ListarMovimientos.jsx'
import FormInsertarMov from './pages/Movimientos_Stock/FormInsertarMov.jsx'
import FormEditMov from './pages/Movimientos_Stock/FormEditMov.jsx'

console.log("Componente HistorialFactura:", HistorialFactura);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Navigate to="/" replace />,
  },

  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/app',
        element: <App />,
      },
      {
        path: '/factura',
        element: <FacturacionHome />,
      },
      {
        path: '/factura/crear',
        element: <CrearFactura />,
      },
      {
        path: '/factura/editar/:id',
        element: <EditarFactura />,
      },
      {
        path: '/factura/cancelar/:id',
        element: <CancelarFactura />, // O puedes llamarlo CancelarFactura si es más semántico
      },
      {
        path: '/factura/historial',
        element: <HistorialFactura />,
      },

      {
        path: '/usuarios',

        element: <ListarUsuarios />,
      },
      {
        path: '/usuarios/nuevo',
        element: <FormCrearUsuario />,
      },
      {
        path: '/usuarios/editar/:id',
        element: <FormEditarUsuario />,
      },
      {
        path: '/usuarios/configuracion',
        element: <ConfigUsuario />,
      },
      {
        path: '/inventario',
        element: <MenuInventario />,
      },
      {
        path: '/inventario/insumos',
        element: <ListarInsumos />,
      },
      {
        path: '/inventario/insumos/nuevo',
        element: <FormCrearInsumo />,
      },
      {
        path: '/inventario/insumos/editar/:id',
        element: <FormEditarInsumo />,
      },
      {
        path:'/inventario/movimientos_stock',
        element: <ListarMovimientosStock />,
      },
      {
        path:'/inventario/movimientos_stock/nuevo',
        element: <FormInsertarMov/>,
      },
      {
        path: '/inventario/movimientos_stock/editar/:id',
        element: <FormEditMov />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
