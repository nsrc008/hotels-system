import React, { useState } from "react";
import { createHotel } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Props para el componente HotelForm
interface HotelFormProps {
  onSave?: () => void; // Función opcional para cerrar el modal y recargar datos
}

// Componente para crear un nuevo hotel mediante un formulario
const HotelForm: React.FC<HotelFormProps> = ({ onSave }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    nit: "",
    numero_habitaciones: 0,
  }); // Estado para los datos del formulario
  const navigate = useNavigate();

  // Maneja el envío del formulario y la creación del hotel
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createHotel(formData)
      .then(() => {
        toast.success("Hotel creado exitosamente");
        if (onSave) {
          onSave(); // Cierra el modal si se pasa la prop
        } else {
          navigate("/"); // Redirige a la lista si no está en un modal
        }
      })
      .catch((err) => {
        const errors = err.response?.data?.errors;
        if (errors) {
          Object.keys(errors).forEach((key) => {
            errors[key].forEach((message: string) => toast.error(message));
          });
        } else {
          toast.error(
            err.response?.data?.message || "Error al guardar el hotel"
          );
        }
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="form-container mx-auto bg-white rounded-lg shadow-md"
    >
      {/* Encabezado con título y botón de retroceder */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Agregar Hotel</h2>
      </div>
      {/* Campos del formulario */}
      <label className="block mb-2 font-medium text-gray-700">Nombre:</label>
      <input
        type="text"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="block mb-2 font-medium text-gray-700">Dirección:</label>
      <input
        type="text"
        placeholder="Dirección"
        value={formData.direccion}
        onChange={(e) =>
          setFormData({ ...formData, direccion: e.target.value })
        }
        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="block mb-2 font-medium text-gray-700">Ciudad:</label>
      <input
        type="text"
        placeholder="Ciudad"
        value={formData.ciudad}
        onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="block mb-2 font-medium text-gray-700">NIT:</label>
      <input
        type="text"
        placeholder="NIT"
        value={formData.nit}
        onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="block mb-2 font-medium text-gray-700">
        Número de Habitaciones:
      </label>
      <input
        type="number"
        placeholder="Número de Habitaciones"
        value={formData.numero_habitaciones}
        onChange={(e) =>
          setFormData({
            ...formData,
            numero_habitaciones: Number(e.target.value),
          })
        }
        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition duration-200"
      >
        Guardar
      </button>
    </form>
  );
};

export default HotelForm;
