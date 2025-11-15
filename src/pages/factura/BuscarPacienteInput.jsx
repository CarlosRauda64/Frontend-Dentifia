import { useState, useEffect, useRef } from 'react';
import { TextInput, Button } from 'flowbite-react';
import { HiUser, HiX } from 'react-icons/hi';
import { API_URL } from '../../api/api';
import { useAuth } from '../../auth/useAuth';

const BuscarPacienteInput = ({ onPacienteSelected, pacienteSeleccionado }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const auth = useAuth();

  // Inicializar con paciente seleccionado
  useEffect(() => {
    if (pacienteSeleccionado) {
      setSearchTerm(pacienteSeleccionado.nombre_completo);
      setShowSuggestions(false);
    } else {
      setSearchTerm('');
    }
  }, [pacienteSeleccionado]);

  // Búsqueda con debounce desde el primer carácter
  useEffect(() => {
    if (searchTerm.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchPacientes = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/pacientes/busqueda_rapida/?q=${encodeURIComponent(searchTerm)}`,
          {
            headers: {
              'Authorization': `Bearer ${auth.getAccessToken()}`
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(data.length > 0);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Error al buscar pacientes:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    };

    // Debounce de 200ms para búsqueda más ágil
    const timer = setTimeout(searchPacientes, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, auth]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Si hay paciente seleccionado y el usuario empieza a escribir diferente, deseleccionar
    if (pacienteSeleccionado && value !== pacienteSeleccionado.nombre_completo) {
      onPacienteSelected(null);
    }
  };

  const handleSuggestionClick = (paciente) => {
    onPacienteSelected(paciente);
    setSearchTerm(paciente.nombre_completo);
    setShowSuggestions(false);
    // Mantener el foco en el input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClear = () => {
    onPacienteSelected(null);
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    // Mantener el foco en el input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay para permitir clicks en sugerencias
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <div className="flex-1">
          <TextInput
            ref={inputRef}
            icon={HiUser}
            placeholder="Buscar paciente (nombre, DUI)..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={loading}
            className="w-full"
          />
        </div>
        {pacienteSeleccionado && (
          <Button 
            size="sm" 
            color="gray" 
            onClick={handleClear}
            className="px-3"
            type="button"
          >
            <HiX className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {showSuggestions && (
        <div className="absolute z-50 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
          {loading ? (
            <div className="p-3 text-center text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Buscando...
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((paciente) => (
              <div
                key={paciente.id}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0 transition-colors"
                onClick={() => handleSuggestionClick(paciente)}
                onMouseDown={(e) => e.preventDefault()} // Prevenir blur del input
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {paciente.nombre_completo}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {paciente.dui ? `DUI: ${paciente.dui}` : 'Sin DUI'} • {paciente.telefono}
                </div>
              </div>
            ))
          ) : searchTerm.length > 0 ? (
            <div className="p-3 text-center text-gray-500 dark:text-gray-400">
              No se encontraron pacientes
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default BuscarPacienteInput;