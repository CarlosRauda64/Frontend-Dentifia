import React from 'react'

const Diente = ({ numero, superficies, onCaraClick }) => {

    const handleClick = (superficie, event) => {
        if(onCaraClick) {
            onCaraClick(numero, superficie, event);
            console.log(`Diente ${numero}, Superficie: ${superficie}`);
        }
    }

    return (
        <div className="border border-gray-400 rounded p-2 m-2 inline-block">
            <svg viewBox="0 0 100 100" width="100" height="100" className="m-2">
                {/* Vestibular (parte superior) */}
                <polygon
                    points="0,0 100,0 75,25 25,25"
                    className={superficies?.vestibular || "fill-white stroke-gray-400 cursor-pointer pointer-events-auto"}
                    onClick={(e) => handleClick('vestibular', e)}
                />

                {/* Distal (lado izquierdo) */}
                <polygon
                    points="0,0 25,25 25,75 0,100"
                    className={superficies?.distal || "fill-white stroke-gray-400 cursor-pointer pointer-events-auto"}
                    onClick={(e) => handleClick('distal', e)}
                />

                {/* Mesial (lado derecho) */}
                <polygon
                    points="75,25 100,0 100,100 75,75"
                    className={superficies?.mesial || "fill-white stroke-gray-400 cursor-pointer pointer-events-auto"}
                    onClick={(e) => handleClick('mesial', e)}
                />

                {/* Oclusal (centro) */}
                <polygon
                    points="25,25 75,25 75,75 25,75"
                    className={superficies?.oclusal || "fill-white stroke-gray-400 cursor-pointer pointer-events-auto"}
                    onClick={(e) => handleClick('oclusal', e)}
                />

                {/* Palatino (parte inferior) */}
                <polygon
                    points="25,75 75,75 100,100 0,100"
                    className={superficies?.palatino || "fill-white stroke-gray-400 cursor-pointer pointer-events-auto"}
                    onClick={(e) => handleClick('palatino', e)}
                />
            </svg>
            {/* Número del diente */}
            <div className="text-center font-bold">{numero}</div>
        </div>
    )
}

export default Diente