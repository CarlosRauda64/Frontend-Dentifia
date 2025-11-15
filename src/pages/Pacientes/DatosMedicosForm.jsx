import { useState } from 'react';
import { Button, Label, TextInput, Textarea, Checkbox } from "flowbite-react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

const DatosMedicosForm = ({ datosMedicos, onDatosMedicosChange, sexo }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [datos, setDatos] = useState(datosMedicos || {});

    const handleInputChange = (field, value) => {
        const newDatos = { ...datos, [field]: value };
        setDatos(newDatos);
        onDatosMedicosChange(newDatos);
    };

    const handleCheckboxChange = (field, checked) => {
        const newDatos = { ...datos, [field]: checked };
        setDatos(newDatos);
        onDatosMedicosChange(newDatos);
    };

    return (
        <div className="w-full">
            <Button
                color="gray"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full mb-4"
            >
                {isOpen ? <HiChevronUp className="mr-2" /> : <HiChevronDown className="mr-2" />}
                Datos Médicos
            </Button>
            
            {isOpen && (
                <div className="grid gap-4 lg:grid-cols-2">
                    
                    {/* Sección: Historial Dental */}
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Historial Dental</h3>
                    </div>
                    
                    <div>
                        <Label htmlFor="ultimaVisita">Última Visita Dental:</Label>
                        <TextInput
                            id="ultimaVisita"
                            type="text"
                            placeholder="Ej: 15 de enero 2024"
                            value={datos.ultimaVisita || ''}
                            onChange={(e) => handleInputChange('ultimaVisita', e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="nombreDentistaAnterior">Nombre del Dentista Anterior:</Label>
                        <TextInput
                            id="nombreDentistaAnterior"
                            type="text"
                            placeholder="Dr. Juan Pérez"
                            value={datos.nombreDentistaAnterior || ''}
                            onChange={(e) => handleInputChange('nombreDentistaAnterior', e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="numeroDentistaAnterior">Teléfono del Dentista Anterior:</Label>
                        <TextInput
                            id="numeroDentistaAnterior"
                            type="tel"
                            placeholder="7777-8888"
                            value={datos.numeroDentistaAnterior || ''}
                            onChange={(e) => handleInputChange('numeroDentistaAnterior', e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="recomendadorDeClinica">Recomendador de la Clínica:</Label>
                        <TextInput
                            id="recomendadorDeClinica"
                            type="text"
                            placeholder="Amigo, familiar, etc."
                            value={datos.recomendadorDeClinica || ''}
                            onChange={(e) => handleInputChange('recomendadorDeClinica', e.target.value)}
                        />
                    </div>

                    {/* Sección: Información Médica */}
                    <div className="lg:col-span-2 mt-4">
                        <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Información Médica</h3>
                    </div>
                    
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-2">
                            <Checkbox
                                id="atendidoPorMedico"
                                checked={datos.atendidoPorMedico || false}
                                onChange={(e) => handleCheckboxChange('atendidoPorMedico', e.target.checked)}
                            />
                            <Label htmlFor="atendidoPorMedico" className="ml-2">
                                ¿Ha sido atendido por un médico recientemente?
                            </Label>
                        </div>
                    </div>
                    
                    <div>
                        <Label htmlFor="nombreMedico">Nombre del Médico:</Label>
                        <TextInput
                            id="nombreMedico"
                            type="text"
                            placeholder="Dr. María González"
                            value={datos.nombreMedico || ''}
                            onChange={(e) => handleInputChange('nombreMedico', e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="telefonoMedico">Teléfono del Médico:</Label>
                        <TextInput
                            id="telefonoMedico"
                            type="tel"
                            placeholder="7777-8888"
                            value={datos.telefonoMedico || ''}
                            onChange={(e) => handleInputChange('telefonoMedico', e.target.value)}
                        />
                    </div>
                    
                    <div className="lg:col-span-2">
                        <Label htmlFor="razonesDeTratamiento">Razones del Tratamiento:</Label>
                        <Textarea
                            id="razonesDeTratamiento"
                            placeholder="Describa las razones del tratamiento médico..."
                            rows={3}
                            value={datos.razonesDeTratamiento || ''}
                            onChange={(e) => handleInputChange('razonesDeTratamiento', e.target.value)}
                        />
                    </div>

                    {/* Sección: Medicamentos */}
                    <div className="lg:col-span-2 mt-4">
                        <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Medicamentos</h3>
                    </div>
                    
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-2">
                            <Checkbox
                                id="tomaMedicamento"
                                checked={datos.tomaMedicamento || false}
                                onChange={(e) => handleCheckboxChange('tomaMedicamento', e.target.checked)}
                            />
                            <Label htmlFor="tomaMedicamento" className="ml-2">
                                ¿Toma medicamentos actualmente?
                            </Label>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-2">
                        <Label htmlFor="medicamentos">Medicamentos que toma:</Label>
                        <Textarea
                            id="medicamentos"
                            placeholder="Liste los medicamentos que toma actualmente..."
                            rows={3}
                            value={datos.medicamentos || ''}
                            onChange={(e) => handleInputChange('medicamentos', e.target.value)}
                        />
                    </div>
                    
                    <div className="lg:col-span-2">
                        <Label htmlFor="razonTomaMedicamento">Razón por la que toma medicamentos:</Label>
                        <Textarea
                            id="razonTomaMedicamento"
                            placeholder="Describa la razón por la que toma medicamentos..."
                            rows={2}
                            value={datos.razonTomaMedicamento || ''}
                            onChange={(e) => handleInputChange('razonTomaMedicamento', e.target.value)}
                        />
                    </div>

                    {/* Sección: Alergias y Condiciones */}
                    <div className="lg:col-span-2 mt-4">
                        <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Alergias y Condiciones</h3>
                    </div>
                    
                    <div className="lg:col-span-2">
                        <Label htmlFor="alergias">Alergias:</Label>
                        <Textarea
                            id="alergias"
                            placeholder="Describa cualquier alergia conocida..."
                            rows={3}
                            value={datos.alergias || ''}
                            onChange={(e) => handleInputChange('alergias', e.target.value)}
                        />
                    </div>
                    
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-2">
                            <Checkbox
                                id="alergicoAnalgesicoDental"
                                checked={datos.alergicoAnalgesicoDental || false}
                                onChange={(e) => handleCheckboxChange('alergicoAnalgesicoDental', e.target.checked)}
                            />
                            <Label htmlFor="alergicoAnalgesicoDental" className="ml-2">
                                ¿Es alérgico a algún analgésico dental?
                            </Label>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-2">
                        <Label htmlFor="enfermedades">Enfermedades:</Label>
                        <Textarea
                            id="enfermedades"
                            placeholder="Describa cualquier enfermedad conocida..."
                            rows={3}
                            value={datos.enfermedades || ''}
                            onChange={(e) => handleInputChange('enfermedades', e.target.value)}
                        />
                    </div>
                    
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-2">
                            <Checkbox
                                id="hemorragiaDespuesDeIntervencion"
                                checked={datos.hemorragiaDespuesDeIntervencion || false}
                                onChange={(e) => handleCheckboxChange('hemorragiaDespuesDeIntervencion', e.target.checked)}
                            />
                            <Label htmlFor="hemorragiaDespuesDeIntervencion" className="ml-2">
                                ¿Ha tenido hemorragia después de alguna intervención?
                            </Label>
                        </div>
                    </div>

                    {/* Sección: Información Reproductiva (solo para mujeres) */}
                    {sexo === 'F' && (
                        <>
                            <div className="lg:col-span-2 mt-4">
                                <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Información Reproductiva</h3>
                            </div>
                            
                            <div className="lg:col-span-2">
                                <div className="flex items-center mb-2">
                                    <Checkbox
                                        id="embarazada"
                                        checked={datos.embarazada || false}
                                        onChange={(e) => handleCheckboxChange('embarazada', e.target.checked)}
                                    />
                                    <Label htmlFor="embarazada" className="ml-2">
                                        ¿Está embarazada?
                                    </Label>
                                </div>
                            </div>
                            
                            {datos.embarazada && (
                                <div>
                                    <Label htmlFor="tiempoEmbarazada">Tiempo de embarazo:</Label>
                                    <TextInput
                                        id="tiempoEmbarazada"
                                        type="text"
                                        placeholder="Ej: 3 meses"
                                        value={datos.tiempoEmbarazada || ''}
                                        onChange={(e) => handleInputChange('tiempoEmbarazada', e.target.value)}
                                    />
                                </div>
                            )}
                            
                            <div className="lg:col-span-2">
                                <div className="flex items-center mb-2">
                                    <Checkbox
                                        id="hijos"
                                        checked={datos.hijos || false}
                                        onChange={(e) => handleCheckboxChange('hijos', e.target.checked)}
                                    />
                                    <Label htmlFor="hijos" className="ml-2">
                                        ¿Tiene hijos?
                                    </Label>
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex items-center mb-2">
                                    <Checkbox
                                        id="partoNatural"
                                        checked={datos.partoNatural || false}
                                        onChange={(e) => handleCheckboxChange('partoNatural', e.target.checked)}
                                    />
                                    <Label htmlFor="partoNatural" className="ml-2">
                                        ¿Tuvo parto natural?
                                    </Label>
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex items-center mb-2">
                                    <Checkbox
                                        id="menstruando"
                                        checked={datos.menstruando || false}
                                        onChange={(e) => handleCheckboxChange('menstruando', e.target.checked)}
                                    />
                                    <Label htmlFor="menstruando" className="ml-2">
                                        ¿Está menstruando?
                                    </Label>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default DatosMedicosForm;
