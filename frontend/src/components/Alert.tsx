import React from 'react';

// Props para el componente Alert
interface AlertProps {
  isOpen: boolean; // Controla la visibilidad de la alerta
  onClose: () => void; // Función para cerrar la alerta
  message: string; // Mensaje a mostrar
  onConfirm?: () => void; // Función opcional para confirmar una acción
  isConfirmation?: boolean; // Indica si es una confirmación (true) o un error (false)
}

// Componente reusable para mostrar alertas o confirmaciones en un modal
const Alert: React.FC<AlertProps> = ({ isOpen, onClose, message, onConfirm, isConfirmation = false }) => {
  if (!isOpen) return null; // No renderiza nada si no está abierto

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Botón de cerrar en la esquina superior derecha */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
        >
          ×
        </button>
        {/* Título dinámico según el tipo de alerta */}
        <h2 className={`text-2xl font-semibold mb-4 ${isConfirmation ? 'text-blue-600' : 'text-red-600'}`}>
          {isConfirmation ? 'Confirmación' : 'Error'}
        </h2>
        <p className="text-gray-800 mb-4">{message}</p>
        <div className="flex space-x-4">
          {isConfirmation ? (
            <>
              {/* Botones para confirmación */}
              <button
                onClick={() => {
                  if (onConfirm) onConfirm();
                  onClose();
                }}
                className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition duration-200"
              >
                Confirmar
              </button>
              <button
                onClick={onClose}
                className="w-1/2 bg-gray-500 hover:bg-gray-600 text-white p-2 rounded transition duration-200"
              >
                Cancelar
              </button>
            </>
          ) : (
            /* Botón único para errores */
            <button
              onClick={onClose}
              className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded transition duration-200"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;