import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHotel, deleteRoomType } from "../services/api";
import RoomTypeForm from "../components/RoomTypeForm";
import Modal from "../components/Modal";
import Alert from "../components/Alert";
import { FaHome } from "react-icons/fa";
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
  const [hotel, setHotel] = useState<Hotel | null>(null); // Tipamos hotel como Hotel | null
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomType | null>(null); // Tipamos editingRoom como RoomType | null
  const [showRoomConfirm, setShowRoomConfirm] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      getHotel(Number(id))
        .then((response) => {
          console.log("getHotel response:", response.data);
          setHotel(response.data);
        })
        .catch((err) => {
          console.error("getHotel error:", err);
        });
    } else {
      console.log("useEffect: No id provided");
    }
  }, [id]);

  const handleDeleteRoomType = (roomId: number) => {
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
          err.response?.data?.message ||
            "Error al eliminar el tipo de habitación"
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

  if (!hotel)
    return <div className="text-center p-4 text-gray-500">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-6 shadow-md fixed w-full top-0 z-10">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleHome}
              className="text-white hover:text-gray-200 focus:outline-none"
              title="Inicio"
            >
              <FaHome className="text-2xl" />
            </button>
            <h1 className="text-3xl font-bold tracking-tight truncate">
              {hotel.nombre}
            </h1>
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto py-6 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="hotel-detail-card bg-white p-6 rounded-lg shadow-md mb-6">
          <p className="text-lg">
            <strong className="font-semibold">Dirección:</strong>{" "}
            {hotel.direccion}
          </p>
          <p className="text-lg">
            <strong className="font-semibold">Ciudad:</strong> {hotel.ciudad}
          </p>
          <p className="text-lg">
            <strong className="font-semibold">NIT:</strong> {hotel.nit}
          </p>
          <p className="text-lg">
            <strong className="font-semibold">Número de Habitaciones:</strong>{" "}
            {hotel.numero_habitaciones}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition duration-200"
          >
            Agregar Tipo de Habitación
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Tipos de Habitación
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {hotel.tipos_habitacion.map(
            (
              room // Quitamos : any, ya que RoomType está definido
            ) => (
              <div
                key={room.id}
                className="border p-4 rounded bg-white shadow-sm hover:shadow-md transition duration-200"
              >
                <p className="text-lg">
                  <strong className="font-semibold">Tipo:</strong> {room.tipo}
                </p>
                <p className="text-lg">
                  <strong className="font-semibold">Acomodación:</strong>{" "}
                  {room.acomodacion}
                </p>
                <p className="text-lg">
                  <strong className="font-semibold">Cantidad:</strong>{" "}
                  {room.cantidad}
                </p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => setEditingRoom(room)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteRoomType(room.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )
          )}
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
