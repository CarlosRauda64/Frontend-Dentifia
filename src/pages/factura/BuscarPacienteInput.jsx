import { useState, useEffect } from 'react';
import { TextInput, Button } from 'flowbite-react';
import { HiUser, HiX } from 'react-icons/hi';
import { API_URL } from '../../api/api';
import { useAuth } from '../../auth/useAuth';

const BuscarPacienteInput = ({ onPacienteSelected, pacienteSeleccionado }) => {
  const [inputValue, setInputValue] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const auth = useAuth();

  // Cuando se selecciona un paciente, mostrar su nombre
  useEffect(() => {
    if (pacienteSeleccionado) {
      setInputValue(pacienteSeleccionado.nombre_completo);
      setIsOpen(false);
    } else {
      setInputValue('');
    }
  }, [pacienteSeleccionado]);

  // Buscar pacientes cuando el usuario escribe
  useEffect(() => {
    if (inputValue.length === 0) {
      setPacientes([]);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(
          `${API_URL}/pacientes/busqueda_rapida/?q=${encodeURIComponent(inputValue)}`,
          {
            headers: {
              'Authorization': `Bearer ${auth.getAccessToken()}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPacientes(data);
          // Solo mostrar resultados si el input está enfocado
          setIsOpen(data.length > 0 && isFocused);
        }
      } catch (error) {
        console.error('Error:', error);
        setPacientes([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, auth, isFocused]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Si el usuario borra o cambia el texto, deseleccionar paciente
    if (pacienteSeleccionado && value !== pacienteSeleccionado.nombre_completo) {
      onPacienteSelected(null);
    }
  };

  const handleSelectPaciente = (paciente) => {
    onPacienteSelected(paciente);
    setInputValue(paciente.nombre_completo);
    setIsOpen(false);
  };

  const handleClear = () => {
    onPacienteSelected(null);
    setInputValue('');
    setIsOpen(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Si hay pacientes cargados, mostrar la lista
    if (pacientes.length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay para permitir clicks en las opciones
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <TextInput
          icon={HiUser}
          placeholder="Buscar paciente..."
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="flex-1"
        />
        {pacienteSeleccionado && (
          <Button size="sm" color="gray" onClick={handleClear}>
            <HiX className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && pacientes.length > 0 && (
        <div className="absolute z-50 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
          {pacientes.map((paciente) => (
            <div
              key={paciente.id}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0"
              onClick={() => handleSelectPaciente(paciente)}
            >
              <div className="font-medium text-gray-900 dark:text-white">
                {paciente.nombre_completo}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {paciente.dui || 'Sin DUI'} • {paciente.telefono}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuscarPacienteInput;
