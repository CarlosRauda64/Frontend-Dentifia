
import React from 'react'
import { Button } from 'flowbite-react'
import Navegacion from './pages/Common/Navegacion.jsx'

const App = () => {
  return (
    <>
      <Navegacion />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold">Hello Tailwind CSS!</h1>
        <Button className="mt-4" href='/login'>Click Me</Button>
      </div>
    </>
  )
}

export default App