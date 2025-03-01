import React, { useState, useEffect } from "react";
import { createHotel, updateHotel } from "../services/api";
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
      ? updateHotel(hotel.id, formData)
      : createHotel(formData);

    request
      .then(() => {
        toast.success(
          hotel ? "Hotel actualizado exitosamente" : "Hotel creado exitosamente"
        );
        if (onSave) {
          onSave();
        } else {
          navigate("/");
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
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
      <form onSubmit={handleSubmit}>
        {/* Encabezado con título dinámico */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            {hotel ? "Editar Hotel" : "Agregar Hotel"}
          </h2>
        </div>

        {/* Campos del formulario */}
        <div className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Ingrese el nombre del hotel"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              placeholder="Ingrese la dirección del hotel"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Ciudad
            </label>
            <input
              type="text"
              placeholder="Ingrese la ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              NIT
            </label>
            <input
              type="text"
              placeholder="Ingrese el NIT del hotel"
              name="nit"
              value={formData.nit}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Número de Habitaciones
            </label>
            <input
              type="number"
              placeholder="Ingrese el número de habitaciones"
              name="numero_habitaciones"
              value={formData.numero_habitaciones}
              onChange={handleChange}
              required
              min="1"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
            />
          </div>
          <br></br>
          {/* Botón de guardar */}
          <button
            type="submit"
            className="p-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelForm;
