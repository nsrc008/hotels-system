<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TipoHabitacion extends Model
{
    use HasFactory;
    
    // Nombre de la tabl
    protected $table = 'tipos_habitacion';

    // Columnas que pueden ser llenadas masivamente
    protected $fillable = [
        'hotel_id',
        'tipo',
        'acomodacion',
        'cantidad',
    ];

    // Desactivar timestamps (no están en el diseño SQL)
    public $timestamps = false;

    // Relación muchos a 1 con Hotel
    public function hotel()
    {
        return $this->belongsTo(Hotel::class, 'hotel_id', 'id');
    }
}
