import { useForm } from 'react-hook-form'
import { Button, Label, TextInput, Select } from "flowbite-react";
import Navegacion from '../Common/Navegacion';
import {
    HiMail,
} from "react-icons/hi";
import {API_URL} from '../../api/api';
import { useAuth } from '../../auth/useAuth';
import { useNavigate } from 'react-router';

const FormUsuario = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const crearUsuario = async (data) => {
        try{
            const response = await fetch(`${API_URL}/usuarios/crear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getAccessToken()}`
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Error al crear el usuario');
            }else{
                navigate('/usuarios');
            }
        }catch (error) {
            console.error('Error al crear el usuario:', error);
        }
    }

    const onSubmit = async (data) => {
        await crearUsuario(data);
        reset();
    }
    return (
        <Navegacion>
            <div className="flex flex-col items-center justify-center w-full h-full max-sm:mt-10">
                <h1 className="text-2xl font-bold mb-4">Crear Usuario</h1>
                <form className="flex flex-col gap-4 bg-gray-900 p-10 rounded-2xl w-[75%] max-w-md" onSubmit={handleSubmit(onSubmit)}>
                    {/* Usuario Input */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="user">Usuario:</Label>
                        </div>
                        <TextInput
                            id="user"
                            type="text"
                            icon={HiMail}
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
                            icon={HiMail}
                            placeholder="Contraseña"
                            name='password'
                            {
                            ...register("password", {
                                required: {
                                    value: true,
                                    message: "Este campo es obligatorio"
                                },
                            })}
                        />
                        {errors.password && <span className="font-medium text-red-500">{errors.password.message}</span>}
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
                        {errors.email && <span className="font-medium text-red-500">{errors.correo.message}</span>}
                    </div>
                    {/* Nombre Input */}
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="name">Nombre de la persona:</Label>
                        </div>
                        <TextInput
                            id="name"
                            type="text"
                            icon={HiMail}
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
                            icon={HiMail}
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
                    <div className='flex gap-2 justify-evenly '>
                        <Button type="submit" className="mt-4">Agregar</Button>
                        <Button href="/usuarios" className="mt-4" color="red">Cancelar</Button>
                    </div>
                </form>
            </div>
        </Navegacion>
    )
}

export default FormUsuario