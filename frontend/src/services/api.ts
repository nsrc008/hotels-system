import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

// Interfaz para un hotel
export interface Hotel {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  nit: string;
  numero_habitaciones: number;
  tipos_habitacion?: RoomType[]; // Opcional, ya que no siempre se incluye
}

// Interfaz para los datos enviados al crear/actualizar un hotel
export interface HotelData {
  nombre: string;
  direccion: string;
  ciudad: string;
  nit: string;
  numero_habitaciones: number;
}

// Interfaz para un tipo de habitación
export interface RoomType {
  id: number;
  tipo: string;
  acomodacion: string;
  cantidad: number;
}

// Interfaz para los datos enviados al crear/actualizar un tipo de habitación
export interface RoomTypeData {
  tipo: "ESTANDAR" | "JUNIOR" | "SUITE";
  acomodacion: "SENCILLA" | "DOBLE" | "TRIPLE" | "CUADRUPLE";
  cantidad: number;
}

// Obtener lista de hoteles
export const getHotels = () => api.get("/hoteles");

// Crear un hotel
export const createHotel = (data: HotelData) =>
  api.post<{ data: Hotel }>("/hoteles", data);

// Obtener un hotel por ID
export const getHotel = (id: number) => api.get(`/hoteles/${id}`);

// Actualizar un hotel
export const updateHotel = (id: number, data: HotelData) =>
  api.put<{ data: Hotel }>(`/hoteles/${id}`, data);

// Eliminar un hotel
export const deleteHotel = (id: number) => api.delete<void>(`/hoteles/${id}`);

// Crear un tipo de habitación
export const createRoomType = (hotelId: number, data: RoomTypeData) =>
  api.post<{ data: RoomType }>(`/hoteles/${hotelId}/habitaciones`, data);

// Actualizar un tipo de habitación
export const updateRoomType = (
  hotelId: number,
  id: number,
  data: RoomTypeData
) =>
  api.put<{ data: RoomType }>(`/hoteles/${hotelId}/habitaciones/${id}`, data);

// Eliminar un tipo de habitación
export const deleteRoomType = (hotelId: number, id: number) =>
  api.delete<void>(`/hoteles/${hotelId}/habitaciones/${id}`);
