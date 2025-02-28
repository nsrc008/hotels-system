<?php

namespace App\Repositories;

use App\Models\TipoHabitacion;

interface TipoHabitacionRepositoryInterface
{
    public function create($hotelId, array $data): TipoHabitacion;
    public function update($hotelId, $id, array $data): TipoHabitacion;
    public function delete($hotelId, $id);
}
