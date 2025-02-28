import React from "react";

// Props para el componente Modal
interface ModalProps {
  isOpen: boolean; // Controla la visibilidad del modal
  onClose: () => void; // Función para cerrar el modal
  children: React.ReactNode; // Contenido interno del modal
}

// Componente reusable para mostrar contenido en un modal centrado
const Modal: React.FC<ModalProps> = ({ isOpen, onClose,   children }) => {
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
        {children}
      </div>
    </div>
  );
};

export default Modal;
