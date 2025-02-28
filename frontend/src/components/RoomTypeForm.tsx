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
      (roomType?.acomodacion as
        | "SENCILLA"
        | "DOBLE"
        | "TRIPLE"
        | "CUADRUPLE") || "SENCILLA",
    cantidad: roomType?.cantidad || 0,
  }); // Estado para los datos del formulario

  // Opciones válidas de acomodación según el tipo de habitación (memoizado para evitar cambios)
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
    <form
      onSubmit={handleSubmit}
      className="form-container mx-auto bg-white rounded-lg shadow-md"
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        {roomType ? "Editar" : "Agregar"} Tipo de Habitación
      </h3>
      <label className="block mb-2 font-medium text-gray-700">Tipo:</label>
      <select
        value={formData.tipo}
        onChange={(e) =>
          setFormData({
            ...formData,
            tipo: e.target.value as "ESTANDAR" | "JUNIOR" | "SUITE",
          })
        }
        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="ESTANDAR">Estándar</option>
        <option value="JUNIOR">Junior</option>
        <option value="SUITE">Suite</option>
      </select>
      <label className="block mb-2 font-medium text-gray-700">
        Acomodación:
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
        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {acomodacionesPorTipo[formData.tipo].map((acomodacion) => (
          <option key={acomodacion} value={acomodacion}>
            {acomodacion.charAt(0) + acomodacion.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
      <label className="block mb-2 font-medium text-gray-700">Cantidad:</label>
      <input
        type="number"
        placeholder="Cantidad"
        value={formData.cantidad}
        onChange={(e) =>
          setFormData({ ...formData, cantidad: Number(e.target.value) })
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

export default RoomTypeForm;
