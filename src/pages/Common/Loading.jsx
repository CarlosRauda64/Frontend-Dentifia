import React from 'react'
import { Spinner } from "flowbite-react";

const custonTheme = {
    spinner: {
        base: "text-gray-500 dark:text-gray-400",
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-30 w-30",
    }
}

const Loading = () => {
  return (
    <div className="flex flex-col flex-wrap items-center gap-2 h-screen justify-center bg-gray-200">
      <Spinner aria-label="Extra large spinner example" className={custonTheme.spinner.base + " " + custonTheme.spinner.xl} />
      <span className="text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">Cargando...</span>
    </div>
  )
}

export default Loading