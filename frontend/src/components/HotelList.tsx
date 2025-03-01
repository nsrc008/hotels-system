import React, { useEffect, useState } from "react";
import { getHotels, deleteHotel } from "../services/api";
import { useNavigate } from "react-router-dom";
import HotelForm from "./HotelForm";
import Modal from "./Modal";
import Alert from "./Alert";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

// Definimos la interfaz Hotel basada en los datos usados
interface Hotel {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  nit: string;
  numero_habitaciones: number;
}

// Componente que muestra la lista de hoteles con mejoras visuales y funcionales
const HotelList: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [showConfirm, setShowConfirm] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!showModal && !editingHotel) {
      getHotels().then((response) => setHotels(response.data));
    }
  }, [showModal, editingHotel]);

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(id);
  };

  const confirmDelete = (id: number) => {
    deleteHotel(id)
      .then(() => {
        setHotels(hotels.filter((hotel) => hotel.id !== id));
        toast.success("Hotel eliminado exitosamente");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Error al eliminar el hotel");
      });
  };

  const handleEdit = (hotel: Hotel, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingHotel(hotel);
  };

  const handleFormSave = () => {
    setShowModal(false);
    setEditingHotel(null);
    getHotels().then((response) => setHotels(response.data));
  };

  const capitalizeName = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Encabezado elegante */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
          Lista de Hoteles
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
        >
          + Agregar Hotel
        </button>
      </div>

      {/* Grid de cards con animación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            onClick={() => navigate(`/hoteles/${hotel.id}`)}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer border border-gray-200 p-6 relative"
          >
            {/* Nombre del hotel */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
              {capitalizeName(hotel.nombre)}
            </h3>
            {/* Detalles del hotel */}
            <p className="text-gray-600 text-sm mb-1">
              {hotel.direccion}, {hotel.ciudad}
            </p>
            <p className="text-gray-600 text-sm mb-1">NIT: {hotel.nit}</p>
            <p className="text-gray-600 text-sm">
              Habitaciones: {hotel.numero_habitaciones}
            </p>

            {/* Botones de acción como íconos a la derecha */}
            <div className="absolute top-4 right-4 flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => handleEdit(hotel, e)}
                className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                title="Editar"
              >
                <FaEdit size={18} />
              </button>
              <button
                onClick={(e) => handleDelete(hotel.id, e)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
                title="Eliminar"
              >
                <FaTrash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para agregar un nuevo hotel */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <HotelForm onSave={handleFormSave} />
      </Modal>

      {/* Modal para editar un hotel existente */}
      <Modal isOpen={!!editingHotel} onClose={() => setEditingHotel(null)}>
        {editingHotel && <HotelForm hotel={editingHotel} onSave={handleFormSave} />}
      </Modal>

      {/* Alerta de confirmación para eliminar */}
      <Alert
        isOpen={showConfirm !== null}
        onClose={() => setShowConfirm(null)}
        message="¿Seguro que quieres eliminar este hotel?"
        onConfirm={() => confirmDelete(showConfirm!)}
        isConfirmation={true}
      />
    </div>
  );
};

export default HotelList;