import React from 'react'

const Diente = ({ numero, superficies }) => {
    return (
        <div className="border border-gray-400 rounded p-2 m-2 inline-block">
            <svg viewBox="0 0 100 100" width="100" height="100" className="m-2">
                {/* Oclusal (parte superior) */}
                <polygon
                    points="0,0 100,0 75,25 25,25"
                    className={superficies?.oclusal || "fill-white stroke-gray-400"}
                />

                {/* Mesial (lado izquierdo) */}
                <polygon
                    points="0,0 25,25 25,75 0,100"
                    className={superficies?.mesial || "fill-white stroke-gray-400"}
                />

                {/* Distal (lado derecho) */}
                <polygon
                    points="75,25 100,0 100,100 75,75"
                    className={superficies?.distal || "fill-white stroke-gray-400"}
                />

                {/* Lingual (centro) */}
                <polygon
                    points="25,25 75,25 75,75 25,75"
                    className={superficies?.lingual || "fill-white stroke-gray-400"}
                />

                {/* Vestibular (parte inferior) */}
                <polygon
                    points="25,75 75,75 100,100 0,100"
                    className={superficies?.vestibular || "fill-white stroke-gray-400"}
                />

                {/* Número del diente */}
               
            </svg>
            <div className="text-center font-bold">{numero}</div>
        </div>
    )
}

export default Diente