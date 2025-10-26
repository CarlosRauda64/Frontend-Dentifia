import React from 'react'
import Navegacion from '../Common/Navegacion.jsx'
import Odontograma from '../Odontograma/Odontrograma.jsx'
import FichaOrtodoncia from '../../fichaOrtodoncia/fichaOrtodoncia.jsx'

import {
    TabItem,
    Tabs,
    Avatar,
    Datepicker
} from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";

const DatosPaciente = () => {
    return (
        <Navegacion>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4 dark:text-white">Datos del Paciente</h1>

                <div>
                    <div className="flex items-center p-4 bg-white dark:bg-gray-800 shadow-md rounded-4xl">
                        <Avatar
                            rounded
                        />
                        <div className="ml-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Juan Pérez</h2>
                            <div className="flex flex-col justify-center items-center md:flex-row md:space-x-1">
                                <p className="text-gray-600 dark:text-gray-300">Fecha de Creación:</p>
                                <Datepicker language="es-MX" disabled />
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">Expediente N°: 123456</p>
                            <p className="text-gray-600 dark:text-gray-300">Edad: 30 años</p>
                            <p className="text-gray-600 dark:text-gray-300">Estado: Activo</p>
                        </div>
                    </div>
                </div>


                <Tabs aria-label="Tabs with icons" variant="underline">
                    <TabItem active title="Ficha de Ortodoncia" icon={HiUserCircle}>
                        <FichaOrtodoncia></FichaOrtodoncia>
                    </TabItem>
                    <TabItem title="Odontograma" icon={MdDashboard}>
                        <Odontograma></Odontograma>
                    </TabItem>
                    <TabItem title="Datos adicionales" icon={HiClipboardList}>
                        This is <span className="font-medium text-gray-800 dark:text-white">Contacts tab's associated content</span>.
                        Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
                        control the content visibility and styling.
                    </TabItem>
                </Tabs>
            </div>
        </Navegacion>
    )
}

export default DatosPaciente