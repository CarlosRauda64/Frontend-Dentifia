import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate} from 'react-router'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login/Login.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import AuthProvider from './auth/AuthProvider.jsx'

const router = createBrowserRouter([
    {
      path: '/',
      element: <Login />,
    },
    {
      path: '/login',
      element: <Navigate to="/" replace />, // Redirige a la página de inicio de sesión
    },
    {
      path: '/',
      element: <ProtectedRoute />, 
      children: [
        {
          path: '/app',
          element: <App />,
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
