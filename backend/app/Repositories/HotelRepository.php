<?php

namespace App\Repositories;

use App\Models\Hotel;

class HotelRepository implements HotelRepositoryInterface
{
    /**
     * Obtiene todos los hoteles con sus tipos de habitación.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all()
    {
        return Hotel::with('tiposHabitacion')->get();
    }

    /**
     * Encuentra un hotel por su ID.
     *
     * @param int $id
     * @return Hotel
     */
    public function find($id)
    {
        return Hotel::with('tiposHabitacion')->findOrFail($id);
    }

    /**
     * Crea un nuevo hotel.
     *
     * @param array $data
     * @return Hotel
     */
    public function create(array $data): Hotel
    {
        return Hotel::create($data);
    }

    /**
     * Actualiza un hotel existente.
     *
     * @param int $id
     * @param array $data
     * @return Hotel
     */
    public function update($id, array $data): Hotel
    {
        $hotel = $this->find($id);
        $hotel->update($data);
        return $hotel;
    }

    /**
     * Elimina un hotel.
     *
     * @param int $id
     * @return void
     */
    public function delete($id)
    {
        $hotel = $this->find($id);
        $hotel->delete();
    }
}
