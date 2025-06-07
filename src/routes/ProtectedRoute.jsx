import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../auth/AuthProvider.jsx';

export default function ProtectedRoute(){
    const auth = useAuth();
    return auth.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}