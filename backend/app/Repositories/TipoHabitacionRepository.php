<?php

namespace App\Repositories;

use App\Models\Hotel;
use App\Models\TipoHabitacion;
use Illuminate\Database\QueryException;
use App\Exceptions\UniqueConstraintViolationException;

class TipoHabitacionRepository implements TipoHabitacionRepositoryInterface
{
    /**
     * Crea un nuevo tipo de habitación para un hotel.
     *
     * @param int $hotelId
     * @param array $data
     * @return TipoHabitacion
     */
    public function create($hotelId, array $data): TipoHabitacion
    {
        try {
            $hotel = Hotel::findOrFail($hotelId);
            $tipoHabitacion = new TipoHabitacion($data);
            $tipoHabitacion->hotel_id = $hotel->id;
            $tipoHabitacion->save();
            return $tipoHabitacion;
        } catch (QueryException $e) {
            if ($e->getCode() === '23505') { // Violación de unicidad en PostgreSQL
                $tipo = $data['tipo'];
                $acomodacion = $data['acomodacion'];
                throw new UniqueConstraintViolationException(
                    "Ya existe un tipo de habitación $tipo con acomodación $acomodacion para este hotel."
                );
            }
            throw $e; // Relanzar otras excepciones no manejadas
        }
    }

    /**
     * Actualiza un tipo de habitación existente.
     *
     * @param int $hotelId
     * @param int $id
     * @param array $data
     * @return TipoHabitacion
     */
    public function update($hotelId, $id, array $data): TipoHabitacion
    {
        $hotel = Hotel::findOrFail($hotelId);
        $tipoHabitacion = TipoHabitacion::where('hotel_id', $hotel->id)->findOrFail($id);
        $tipoHabitacion->update($data);
        return $tipoHabitacion;
    }

    /**
     * Elimina un tipo de habitación.
     *
     * @param int $hotelId
     * @param int $id
     * @return void
     */
    public function delete($hotelId, $id)
    {
        $hotel = Hotel::findOrFail($hotelId);
        $tipoHabitacion = TipoHabitacion::where('hotel_id', $hotel->id)->findOrFail($id);
        $tipoHabitacion->delete();
    }
}
