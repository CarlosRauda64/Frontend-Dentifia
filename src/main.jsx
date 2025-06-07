import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login/Login.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import AuthProvider from './auth/AuthProvider.jsx'

const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/',
      element: <ProtectedRoute />, // Assuming you have a ProtectedRoute component
      children: [
        {
          path: '/app',
          element: <App />, // Replace with your protected component
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
