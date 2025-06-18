import React from 'react'
import { useState, useEffect } from 'react'
import { useAuth } from '../../auth/useAuth'
import Navegacion from '../Common/Navegacion'
import {
    Card,
    Button,
    Label,
    TextInput,
    Select,
    HelperText,
    Modal,
    ModalBody,
    ModalHeader
} from "flowbite-react";
import { HiUser, HiLockClosed, HiMail, HiOutlineClipboard } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { API_URL } from '../../api/api';

const ConfigUsuario = () => {
    const auth = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const [usuario, setUsuario] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    function onCloseModal() {
        setOpenModal(false);
    }

    const editarUsuario = async (data) => {
        const id = auth.getUser().id; // Obtener el ID del usuario desde el contexto de autenticación
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
                setUsuario(data);
                setOpenModal(false);
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
        reset({ ...auth.getUser(), password: '' });
        setUsuario(auth.getUser());
    }, [auth, reset]);

    return (
        <Navegacion>
            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <ModalHeader />
                <ModalBody>
                    <form className="flex flex-col gap-4 rounded-2xl w-full max-w-md lg:grid lg:grid-cols-2 lg:max-w-4xl" onSubmit={handleSubmit(onSubmit)}>
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
                        <div className="max-w-md col-span-2 lg:m-auto">
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
                        <div className='flex gap-2 justify-evenly items-center col-span-2'>
                            <Button type="submit" className="mt-4">Editar</Button>
                            <Button onClick={() => setOpenModal(false)} className="mt-4" color="red">Cancelar</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
            <div className='h-screen w-auto flex items-center justify-center'>
                <Card className="flex flex-col items-center justify-center max-w-3xl min-w-1.5 p-6 bg-white dark:bg-gray-800 shadow-md">
                    <h1 className='text-center font-medium text-black dark:text-white pb-7'>Configuración de Usuario</h1>
                    <section className="flex flex-col gap-4 w-full">
                        <div className="flex items-center gap-1">
                            <HiUser size={25} className="text-gray-500 dark:text-gray-400" />
                            <p className='font-medium max-sm:text-sm text-black dark:text-gray-400'>Usuario:</p>
                            <p className="text-gray-500 dark:text-gray-400">{usuario.usuario}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <HiMail size={25} className="text-gray-500 dark:text-gray-400" />
                            <p className='font-medium max-sm:text-sm text-black dark:text-gray-400'>Correo Electrónico:</p>
                            <p className="text-gray-500 dark:text-gray-400">{usuario.email}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <HiOutlineClipboard size={25} className="text-gray-500 dark:text-gray-400" />
                            <p className='font-medium max-sm:text-sm text-black dark:text-gray-400'>Nombre:</p>
                            <p className="text-gray-500 dark:text-gray-400">{usuario.nombre}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <HiOutlineClipboard size={25} className="text-gray-500 dark:text-gray-400" />
                            <p className='font-medium max-sm:text-sm text-black dark:text-gray-400'>Apellido:</p>
                            <p className="text-gray-500 dark:text-gray-400">{usuario.apellido}</p>
                        </div>
                        <div className="col-span-2 flex items-center gap-1">
                            <HiUser size={25} className="text-gray-500 dark:text-gray-400" />
                            <p className='font-medium max-sm:text-sm text-black dark:text-gray-400'>Rol:</p>
                            <p className="text-gray-500 dark:text-gray-400">{usuario.rol}</p>
                        </div>
                    </section>
                    <Button onClick={() => setOpenModal(true)}
                        color="blue"
                        className="mt-6 mx-auto">
                        Editar Usuario
                    </Button>
                </Card>
            </div>
        </Navegacion>
    )
}

export default ConfigUsuario