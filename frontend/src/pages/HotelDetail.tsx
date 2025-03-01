import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHotel, deleteRoomType } from "../services/api";
import RoomTypeForm from "../components/RoomTypeForm";
import Modal from "../components/Modal";
import Alert from "../components/Alert";
import { FaHome, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

// Definimos las interfaces basadas en los datos usados
interface RoomType {
  id: number;
  tipo: string;
  acomodacion: string;
  cantidad: number;
}

interface Hotel {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  nit: string;
  numero_habitaciones: number;
  tipos_habitacion: RoomType[];
}

const HotelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);
  const [showRoomConfirm, setShowRoomConfirm] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      getHotel(Number(id))
        .then((response) => {
          setHotel(response.data);
        })
        .catch((err) => {
          console.error("getHotel error:", err);
        });
    } else {
      console.log("useEffect: No id provided");
    }
  }, [id]);

  const handleDeleteRoomType = (roomId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowRoomConfirm(roomId);
  };

  const confirmDeleteRoomType = (roomId: number) => {
    deleteRoomType(Number(id), roomId)
      .then(() => {
        setHotel({
          ...hotel!,
          tipos_habitacion: hotel!.tipos_habitacion.filter(
            (r) => r.id !== roomId
          ),
        });
        toast.success("Tipo de habitación eliminado exitosamente");
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Error al eliminar el tipo de habitación"
        );
      });
  };

  const handleSaveRoom = () => {
    getHotel(Number(id)).then((response) => {
      setHotel(response.data);
      setShowAddModal(false);
      setEditingRoom(null);
    });
  };

  const handleHome = () => {
    navigate("/");
  };

  const capitalizeName = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (!hotel)
    return (
      <div className="text-center p-6 text-gray-500 text-lg">Cargando...</div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-indigo-600 text-white p-6 shadow-lg fixed w-full top-0 z-10">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleHome}
              className="text-white hover:text-indigo-200 transition-colors duration-200 focus:outline-none"
              title="Inicio"
              data-testid="home-button"
            >
              <FaHome className="text-2xl" />
            </button>
            <h1 className="text-3xl font-bold tracking-tight truncate">
              {capitalizeName(hotel.nombre)}
            </h1>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <p className="text-lg text-gray-700 mb-2">
            <strong className="font-semibold text-gray-900">Dirección:</strong>{" "}
            {hotel.direccion}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <strong className="font-semibold text-gray-900">Ciudad:</strong>{" "}
            {hotel.ciudad}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <strong className="font-semibold text-gray-900">NIT:</strong>{" "}
            {hotel.nit}
          </p>
          <p className="text-lg text-gray-700 mb-4">
            <strong className="font-semibold text-gray-900">Número de Habitaciones:</strong>{" "}
            {hotel.numero_habitaciones}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
            data-testid="add-room-type-button"
          >
            + Agregar Tipo de Habitación
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Tipos de Habitación
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotel.tipos_habitacion.map((room) => (
            <div
              key={room.id}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-gray-200 p-6 relative"
            >
              <p className="text-gray-700 text-sm mb-1">
                <strong className="font-semibold text-gray-900">Tipo:</strong>{" "}
                {room.tipo.charAt(0) + room.tipo.slice(1).toLowerCase()}
              </p>
              <p className="text-gray-700 text-sm mb-1">
                <strong className="font-semibold text-gray-900">
                  Acomodación:
                </strong>{" "}
                {room.acomodacion.charAt(0) +
                  room.acomodacion.slice(1).toLowerCase()}
              </p>
              <p className="text-gray-700 text-sm mb-2">
                <strong className="font-semibold text-gray-900">
                  Cantidad:
                </strong>{" "}
                {room.cantidad}
              </p>

              <div className="absolute top-4 right-4 flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => setEditingRoom(room)}
                  className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  title="Editar"
                  data-testid={`edit-room-${room.id}`}
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={(e) => handleDeleteRoomType(room.id, e)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  title="Eliminar"
                  data-testid={`delete-room-${room.id}`}
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
          <RoomTypeForm hotelId={Number(id)} onSave={handleSaveRoom} />
        </Modal>

        <Modal isOpen={!!editingRoom} onClose={() => setEditingRoom(null)}>
          {editingRoom && (
            <RoomTypeForm
              hotelId={Number(id)}
              roomType={editingRoom}
              onSave={handleSaveRoom}
            />
          )}
        </Modal>

        <Alert
          isOpen={showRoomConfirm !== null}
          onClose={() => setShowRoomConfirm(null)}
          message="¿Seguro que quieres eliminar este tipo de habitación?"
          onConfirm={() => confirmDeleteRoomType(showRoomConfirm!)}
          isConfirmation={true}
        />
      </main>
    </div>
  );
};

export default HotelDetail;