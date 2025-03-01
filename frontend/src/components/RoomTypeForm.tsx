import React, { useState, useEffect, useMemo } from "react";
import { createRoomType, updateRoomType } from "../services/api";
import { toast } from "react-toastify";

// Props para el componente RoomTypeForm
interface RoomTypeFormProps {
  hotelId: number; // ID del hotel al que pertenece el tipo de habitación
  roomType?: {
    id: number;
    tipo: string;
    acomodacion: string;
    cantidad: number;
  }; // Datos del tipo de habitación para edición (opcional)
  onSave: () => void; // Función para cerrar el modal y recargar datos
}

// Tipamos el estado formData
interface RoomTypeData {
  tipo: "ESTANDAR" | "JUNIOR" | "SUITE";
  acomodacion: "SENCILLA" | "DOBLE" | "TRIPLE" | "CUADRUPLE";
  cantidad: number;
}

// Componente para crear o editar un tipo de habitación mediante un formulario
const RoomTypeForm: React.FC<RoomTypeFormProps> = ({
  hotelId,
  roomType,
  onSave,
}) => {
  const [formData, setFormData] = useState<RoomTypeData>({
    tipo: (roomType?.tipo as "ESTANDAR" | "JUNIOR" | "SUITE") || "ESTANDAR",
    acomodacion:
      (roomType?.acomodacion as "SENCILLA" | "DOBLE" | "TRIPLE" | "CUADRUPLE") ||
      "SENCILLA",
    cantidad: roomType?.cantidad || 0,
  });

  // Opciones válidas de acomodación según el tipo de habitación (memoizado)
  const acomodacionesPorTipo = useMemo<{
    [key in "ESTANDAR" | "JUNIOR" | "SUITE"]: string[];
  }>(
    () => ({
      ESTANDAR: ["SENCILLA", "DOBLE"],
      JUNIOR: ["TRIPLE", "CUADRUPLE"],
      SUITE: ["SENCILLA", "DOBLE", "TRIPLE"],
    }),
    []
  );

  // Ajusta la acomodación si cambia el tipo y no es válida
  useEffect(() => {
    if (!acomodacionesPorTipo[formData.tipo].includes(formData.acomodacion)) {
      setFormData((prev) => ({
        ...prev,
        acomodacion: acomodacionesPorTipo[formData.tipo][0] as
          | "SENCILLA"
          | "DOBLE"
          | "TRIPLE"
          | "CUADRUPLE",
      }));
    }
  }, [formData.tipo, formData.acomodacion, acomodacionesPorTipo]);

  // Maneja el envío del formulario y la creación/edición del tipo de habitación
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const request = roomType
      ? updateRoomType(hotelId, roomType.id, formData)
      : createRoomType(hotelId, formData);

    request
      .then(() => {
        toast.success(
          roomType
            ? "Tipo de habitación actualizado exitosamente"
            : "Tipo de habitación creado exitosamente"
        );
        onSave();
        if (!roomType)
          setFormData({
            tipo: "ESTANDAR",
            acomodacion: "SENCILLA",
            cantidad: 0,
          });
      })
      .catch((err) => {
        const errors = err.response?.data?.errors;
        if (errors) {
          Object.keys(errors).forEach((key) => {
            errors[key].forEach((message: string) => toast.error(message));
          });
        } else {
          toast.error(
            err.response?.data?.message ||
              "Error al guardar el tipo de habitación"
          );
        }
      });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <form onSubmit={handleSubmit}>
        {/* Encabezado con título dinámico */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
            {roomType ? "Editar" : "Agregar"} Tipo de Habitación
          </h3>
        </div>

        {/* Campos del formulario */}
        <div className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select
              value={formData.tipo}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tipo: e.target.value as "ESTANDAR" | "JUNIOR" | "SUITE",
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
            >
              <option value="ESTANDAR">Estándar</option>
              <option value="JUNIOR">Junior</option>
              <option value="SUITE">Suite</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Acomodación
            </label>
            <select
              value={formData.acomodacion}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  acomodacion: e.target.value as
                    | "SENCILLA"
                    | "DOBLE"
                    | "TRIPLE"
                    | "CUADRUPLE",
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
            >
              {acomodacionesPorTipo[formData.tipo].map((acomodacion) => (
                <option key={acomodacion} value={acomodacion}>
                  {acomodacion.charAt(0) +
                    acomodacion.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Cantidad
            </label>
            <input
              type="number"
              placeholder="Ingrese la cantidad"
              value={formData.cantidad}
              onChange={(e) =>
                setFormData({ ...formData, cantidad: Number(e.target.value) })
              }
              required
              min="1"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
            />
          </div>
              <br></br>
          {/* Botón de guardar */}
          <button
            type="submit"
            className="p-2 w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomTypeForm;