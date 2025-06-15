import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate} from 'react-router'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login/Login.jsx'
import Loading from './pages/Common/Loading.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import AuthProvider from './auth/AuthProvider.jsx'
import ListarUsuarios from './pages/Usuarios/ListarUsuarios.jsx'
import FormUsuario from './pages/Usuarios/FormUsuario.jsx'

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
      path: '/usuarios/nuevo',
      element: <FormUsuario />,
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
          path: '/usuarios',
          element: <ListarUsuarios />,
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
