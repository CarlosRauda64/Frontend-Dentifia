import React from 'react'
import {
    Datepicker
} from "flowbite-react";

const MenuSnapshot = () => {
  return (
    <>
        <div className="p-4">
            <Datepicker
                className="w-full"

                placeholder="Selecciona una fecha"
                language="es-MX"
            />
        </div>
    </>
  )
}

export default MenuSnapshot