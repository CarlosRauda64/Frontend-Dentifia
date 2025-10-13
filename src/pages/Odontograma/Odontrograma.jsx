import React from 'react'
import Navegacion from '../Common/Navegacion'
import Diente from './Diente'

const Odontrograma = () => (
    <Navegacion>
        <Diente
            numero ={11}
            superficies={{
                mesial: "fill-red-400", // caries
                distal: "fill-blue-400", // restauración
                oclusal: "fill-green-400", // sellante
                vestibular: "fill-green-400",
                lingual: ""
            }} />
            <Diente
            numero ={12}
            superficies={{
                mesial: "fill-red-400", // caries
                distal: "fill-blue-400", // restauración
                oclusal: "fill-green-400", // sellante
                vestibular: "",
                lingual: ""
            }} />
    </Navegacion>
)

export default Odontrograma