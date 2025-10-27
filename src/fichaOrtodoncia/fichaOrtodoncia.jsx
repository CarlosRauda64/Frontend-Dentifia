import React from 'react'
import TableFichas from './tableFichasOrtodoncia.jsx'

const FichaOrtodoncia = ({ expedienteId, onRefresh }) => {
  return (
    <TableFichas expedienteId={expedienteId} onRefresh={onRefresh} />
  )
}

export default FichaOrtodoncia