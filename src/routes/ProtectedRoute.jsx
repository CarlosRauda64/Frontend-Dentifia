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

export function ProtectedAdministrador(){
    const auth = useAuth();
    console.log("ProtectedAdministrador", auth.isAuthenticated, auth.getUser());
    if(!auth.isAuthenticated || auth.getUser().rol !== 'administrador') {
        console.log("No está autenticado o no es administrador, redirigiendo a la página de autorización.");
        return <Navigate to="/autorizacion" replace />;
    }
    return <Outlet />;
}

export function ProtectedSecretaria(){
    const auth = useAuth();
    console.log("ProtectedSecretaria", auth.isAuthenticated, auth.getUser());
    if(!auth.isAuthenticated || auth.getUser().rol !== 'secretaria' && auth.getUser().rol !== 'administrador') {
        console.log("No está autenticado o no es secretaria, redirigiendo a la página de autorización.");
        return <Navigate to="/autorizacion" replace />;
    }
    return <Outlet />;
}

export function ProtectedDoctor(){
    const auth = useAuth();
    console.log("ProtectedDoctor", auth.isAuthenticated, auth.getUser());
    if(!auth.isAuthenticated || auth.getUser().rol !== 'doctor' && auth.getUser().rol !== 'administrador') {
        console.log("No está autenticado o no es doctor, redirigiendo a la página de autorización.");
        return <Navigate to="/autorizacion" replace />;
    }
    return <Outlet />;
}
