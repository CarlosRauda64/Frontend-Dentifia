import React from 'react'
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useAuth } from '../../auth/AuthProvider';
import { API_URL } from '../../api/api';

const Login = () => {
    const [usuario, setUsuario] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorResponse, setErrorResponse] = React.useState(null);

    const auth = useAuth();

    async function handleSubmit(event) {
        event.preventDefault();
        console.log("Usuario:", usuario);
        console.log("Contraseña:", password);
        try {
            const response = await fetch(`${API_URL}/usuarios/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario: usuario,
                    password: password
                }),
            });

            if (response.ok) {
                console.log('Inicio de sesión exitoso');
                console.log(response);
            }else{
                const json = await response.json();
                console.error('Error al iniciar sesión:', json);
                setErrorResponse(json);
                return;
            }
        }
        catch (error) {
            // Manejo de errores en caso de que el inicio de sesión falle.
            console.error("Error al iniciar sesión:", error);
            alert("Usuario o contraseña incorrectos");
        }
    }
    return (
        <>
            <section className="flex items-center justify-between h-screen bg-gray-200 
                max-lg:block max-lg:w-full max-lg:h-full">
                <div className="h-screen w-full">
                    <img className='h-full object-cover max-lg:opacity-75 max-lg:blur-sm' src="https://res.cloudinary.com/drfyvt5er/image/upload/v1749273144/dentista-examinando-los-dientes-del-paciente-femenino_1_ahizkc.jpg" alt="fondo-img" />
                </div>
                <div className="flex justify-center items-center w-full h-screen max-lg:fixed max-lg:inset-0">
                    <div className="flex flex-col justify-center items-center gap-4 bg-gray-600 p-6 rounded-lg shadow-lg w-2/4 max-lg:w-2/5 max-sm:w-3/4">
                        <div>
                            <img className='w-20 h-20 border-2 rounded-full' src="https://res.cloudinary.com/drfyvt5er/image/upload/v1749261016/2203549_admin_avatar_human_login_user_icon_pa5k6p.svg" alt="login-img" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Iniciar Sesión</h1>
                        {/* Formulario de inicio de sesión para acceder al sistema. */}
                        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="usuario">Usuario</Label>
                                </div>
                                <TextInput 
                                id="usuario" 
                                type="text" 
                                placeholder="Usuario" 
                                required 
                                value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="password">Contraseña</Label>
                                </div>
                                <TextInput 
                                id="password" 
                                type="password" 
                                placeholder="Contraseña" 
                                required 
                                value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <Button type="submit" color="blue" className='mt-4'>Iniciar Sesión</Button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login