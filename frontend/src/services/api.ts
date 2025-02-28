import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // URL de tu backend Laravel
});

export const getHotels = () => api.get("/hoteles");
export const createHotel = (data: any) => api.post("/hoteles", data);
export const getHotel = (id: number) => api.get(`/hoteles/${id}`);
export const updateHotel = (id: number, data: any) =>
  api.put(`/hoteles/${id}`, data);
export const deleteHotel = (id: number) => api.delete(`/hoteles/${id}`);
export const createRoomType = (hotelId: number, data: any) =>
  api.post(`/hoteles/${hotelId}/habitaciones`, data);
export const updateRoomType = (hotelId: number, id: number, data: any) =>
  api.put(`/hoteles/${hotelId}/habitaciones/${id}`, data);
export const deleteRoomType = (hotelId: number, id: number) =>
  api.delete(`/hoteles/${hotelId}/habitaciones/${id}`);
