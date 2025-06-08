import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../auth/useAuth';

export default function ProtectedRoute(){
    const auth = useAuth();
    console.log("ProtectedRoute", auth.isAuthenticated);
    //return auth.isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
    if(!auth.isAuthenticated) {
        console.log("No está autenticado, redirigiendo a la página de inicio de sesión.");
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}