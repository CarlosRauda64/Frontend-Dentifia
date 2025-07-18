import { useForm } from 'react-hook-form'
import { Button, Label, TextInput, Select, HelperText } from "flowbite-react";
import Navegacion from '../Common/Navegacion';
import {
    HiMail,
    HiUser,
    HiOutlineClipboard,
    HiLockClosed
} from "react-icons/hi";
import { API_URL } from '../../api/api';
import { useAuth } from '../../auth/useAuth';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { useEffect } from 'react';

const FormUsuario = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const obtenerUsuario = async (id) => {
        try {
            const response = await fetch(`${API_URL}/usuarios/api_usuarios/${id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener el usuario');
            }
            const usuario = await response.json();
            console.log("Usuario obtenido:", usuario);
            reset({ ...usuario, password: '' }); // Resetea el formulario con los datos del usuario
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
        }
    };

    const editarUsuario = async (data) => {
        try {
            console.log("Datos del formulario para editar:", data);
            const response = await fetch(`${API_URL}/usuarios/editar/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Error al editar el usuario');
            } else {
                navigate('/usuarios');
            }
        } catch (error) {
            console.error('Error al editar el usuario:', error);
        }
    }

    const onSubmit = async (data) => {
        await editarUsuario(data);
        reset();
    }

    useEffect(() => {
        if (id) {
            obtenerUsuario(id);
        }
    }, []);

    return (
        <Navegacion>
            <div className="flex flex-col items-center sm:justify-center w-full h-full max-sm:mt-10">
                <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Editar Usuario</h1>
                <form className="flex flex-col gap-4 dark:bg-gray-800 bg-white p-10 rounded-2xl w-[75%] max-w-md lg:grid lg:grid-cols-2 lg:max-w-4xl" onSubmit={handleSubmit(onSubmit)}>
                    {/* Usuario Input */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="user">Usuario:</Label>
                        </div>
                        <TextInput
                            id="user"
                            type="text"
                            icon={HiUser}
                            placeholder="Usuario"
                            name='usuario'
                            {
                            ...register("usuario", {
                                required: {
                                    value: true,
                                    message: "Este campo es obligatorio"
                                },
                                minLength: {
                                    value: 3,
                                    message: "Mínimo 3 caracteres"
                                },
                                maxLength: {
                                    value: 20,
                                    message: "Máximo 20 caracteres"
                                }
                            })}
                        />
                        {errors.usuario && <span className="font-medium text-red-500">{errors.usuario.message}</span>}
                    </div>
                    {/* Contraseña Input */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="password">Contraseña:</Label>
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            icon={HiLockClosed}
                            placeholder="Contraseña"
                            name='password'
                            {...register("password")}
                        />
                        <HelperText>
                            <span className="text-sm text-gray-400">Dejar en blanco si no se desea cambiar la contraseña</span>
                        </HelperText>
                    </div>
                    {/* Correo Electrónico Input */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="email">Correo Electrónico:</Label>
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            icon={HiMail}
                            placeholder="Correo Electrónico"
                            name='email'
                            {
                            ...register("email", {
                                required: {
                                    value: true,
                                    message: "Este campo es obligatorio"
                                },
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Formato de correo inválido"
                                }
                            })}
                        />
                        {errors.email && <span className="font-medium text-red-500">{errors.email.message}</span>}
                    </div>
                    {/* Nombre Input */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="name">Nombre de la persona:</Label>
                        </div>
                        <TextInput
                            id="name"
                            type="text"
                            icon={HiOutlineClipboard}
                            placeholder="Nombre "
                            name='nombre'
                            {
                            ...register("nombre", {
                                required: {
                                    value: true,
                                    message: "Este campo es obligatorio"
                                },
                                maxLength: {
                                    value: 50,
                                    message: "Máximo 50 caracteres"
                                },
                            })}
                        />
                        {errors.nombre && <span className="font-medium text-red-500">{errors.nombre.message}</span>}
                    </div>
                    {/* Apellido Input */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="apellido">Apellido de la persona:</Label>
                        </div>
                        <TextInput
                            id="apellido"
                            type="text"
                            icon={HiOutlineClipboard}
                            placeholder="Apellido "
                            name='apellido'
                            {
                            ...register("apellido", {
                                required: {
                                    value: true,
                                    message: "Este campo es obligatorio"
                                },
                                maxLength: {
                                    value: 50,
                                    message: "Máximo 50 caracteres"
                                },
                            })}
                        />
                        {errors.apellido && <span className="font-medium text-red-500">{errors.apellido.message}</span>}
                    </div>
                    {/* Rol Input */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="rol">Seleccionar el rol</Label>
                        </div>
                        <Select id="rol" name="rol"
                            {...register("rol", {
                                required: {
                                    value: true,
                                    message: "Este campo es obligatorio"
                                },
                            })}
                        >
                            <option value="" disabled selected>Seleccione un rol</option>
                            <option>administrador</option>
                            <option>doctor</option>
                            <option>secretaria</option>
                        </Select>
                        {errors.rol && <span className="font-medium text-red-500">{errors.rol.message}</span>}

                    </div>
                    {/* Botones en el formulario */}
                    <div className='flex gap-2 justify-evenly items-center col-span-2'>
                        <Button type="submit" className="mt-4">Editar</Button>
                        <Button href="/usuarios" className="mt-4" color="red">Cancelar</Button>
                    </div>
                </form>
            </div>
        </Navegacion>
    )
}

export default FormUsuario