<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Hotel extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'hoteles';

    // Columnas que pueden ser llenadas masivamente
    protected $fillable = [
        'nombre',
        'direccion',
        'ciudad',
        'nit',
        'numero_habitaciones',
    ];

    // Desactivar timestamps (no están en el diseño SQL)
    public $timestamps = false;

    // Relación 1 a muchos con TipoHabitacion
    public function tiposHabitacion()
    {
        return $this->hasMany(TipoHabitacion::class, 'hotel_id', 'id');
    }
}
