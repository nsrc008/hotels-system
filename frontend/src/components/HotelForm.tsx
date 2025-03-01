import React, { useState, useEffect } from "react";
import { createHotel, updateHotel } from "../services/api"; // Añadimos updateHotel
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Definimos la interfaz Hotel basada en los datos usados
interface Hotel {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  nit: string;
  numero_habitaciones: number;
}

// Props para el componente HotelForm
interface HotelFormProps {
  hotel?: Hotel; // Hotel opcional para edición
  onSave?: () => void; // Función opcional para cerrar el modal y recargar datos
}

// Componente para crear o editar un hotel mediante un formulario
const HotelForm: React.FC<HotelFormProps> = ({ hotel, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    nit: "",
    numero_habitaciones: 0,
  });
  const navigate = useNavigate();

  // Carga los datos del hotel en el formulario si se proporciona un hotel para editar
  useEffect(() => {
    if (hotel) {
      setFormData({
        nombre: hotel.nombre,
        direccion: hotel.direccion,
        ciudad: hotel.ciudad,
        nit: hotel.nit,
        numero_habitaciones: hotel.numero_habitaciones,
      });
    }
  }, [hotel]);

  // Maneja los cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numero_habitaciones" ? Number(value) : value,
    }));
  };

  // Maneja el envío del formulario, creando o actualizando según corresponda
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const request = hotel
      ? updateHotel(hotel.id, formData) // Actualiza si hay un hotel
      : createHotel(formData); // Crea si no hay hotel

    request
      .then(() => {
        toast.success(
          hotel ? "Hotel actualizado exitosamente" : "Hotel creado exitosamente"
        );
        if (onSave) {
          onSave(); // Cierra el modal y recarga datos si está en un modal
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
      {/* Encabezado con título dinámico */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {hotel ? "Editar Hotel" : "Agregar Hotel"}
        </h2>
      </div>
      {/* Campos del formulario */}
      <label className="block mb-2 font-medium text-gray-700">Nombre:</label>
      <input
        type="text"
        placeholder="Nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="block mb-2 font-medium text-gray-700">Dirección:</label>
      <input
        type="text"
        placeholder="Dirección"
        name="direccion"
        value={formData.direccion}
        onChange={handleChange}
        required
        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="block mb-2 font-medium text-gray-700">Ciudad:</label>
      <input
        type="text"
        placeholder="Ciudad"
        name="ciudad"
        value={formData.ciudad}
        onChange={handleChange}
        required
        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="block mb-2 font-medium text-gray-700">NIT:</label>
      <input
        type="text"
        placeholder="NIT"
        name="nit"
        value={formData.nit}
        onChange={handleChange}
        required
        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="block mb-2 font-medium text-gray-700">
        Número de Habitaciones:
      </label>
      <input
        type="number"
        placeholder="Número de Habitaciones"
        name="numero_habitaciones"
        value={formData.numero_habitaciones}
        onChange={handleChange}
        required
        min="1"
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
