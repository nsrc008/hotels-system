import React, { useEffect, useState } from "react";
import { getHotels, deleteHotel } from "../services/api";
import { Link } from "react-router-dom";
import HotelForm from "./HotelForm";
import Modal from "./Modal";
import Alert from "./Alert";
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

// Componente que muestra la lista de hoteles y permite agregar o eliminar hoteles
const HotelList: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]); // Tipamos el estado como Hotel[]
  const [showModal, setShowModal] = useState(false); // Controla la visibilidad del modal para agregar hotel
  const [showConfirm, setShowConfirm] = useState<number | null>(null); // ID del hotel a eliminar

  // Carga la lista de hoteles al montar el componente o al cerrar el modal
  useEffect(() => {
    if (!showModal) {
      getHotels().then((response) => setHotels(response.data));
    }
  }, [showModal]);

  // Maneja la solicitud de eliminación de un hotel, mostrando una confirmación
  const handleDelete = (id: number) => {
    setShowConfirm(id);
  };

  // Confirma y ejecuta la eliminación de un hotel
  const confirmDelete = (id: number) => {
    deleteHotel(id)
      .then(() => {
        setHotels(hotels.filter((hotel) => hotel.id !== id));
        toast.success("Hotel eliminado exitosamente");
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Error al eliminar el hotel"
        );
      });
  };

  // Cierra el modal y recarga la lista de hoteles tras guardar
  const handleFormSave = () => {
    setShowModal(false);
    getHotels().then((response) => setHotels(response.data));
  };

  return (
    <div className="p-4">
      {/* Encabezado con título y botón para agregar hotel */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Lista de Hoteles
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition duration-200"
        >
          Agregar Hotel
        </button>
      </div>
      {/* Lista de hoteles en un grid responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="border p-4 rounded bg-white shadow-sm hover:shadow-md transition duration-200"
          >
            <h3 className="text-xl font-medium text-gray-900">
              {hotel.nombre}
            </h3>
            <p className="text-gray-600">
              {hotel.direccion}, {hotel.ciudad}
            </p>
            <p className="text-gray-600">NIT: {hotel.nit}</p>
            <p className="text-gray-600">
              Habitaciones: {hotel.numero_habitaciones}
            </p>
            <div className="mt-2 space-x-2">
              <Link
                to={`/hoteles/${hotel.id}`}
                className="p-2 text-blue-500 hover:text-blue-700"
              >
                Ver detalles
              </Link>
              <button
                onClick={() => handleDelete(hotel.id)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para agregar un nuevo hotel */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <HotelForm onSave={handleFormSave} />
      </Modal>

      {/* Alerta de confirmación para eliminar un hotel */}
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