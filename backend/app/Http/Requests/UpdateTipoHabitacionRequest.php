<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Hotel;
use App\Models\TipoHabitacion;

class UpdateTipoHabitacionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'tipo' => 'sometimes|in:ESTANDAR,JUNIOR,SUITE',
            'acomodacion' => [
                'sometimes',
                'in:SENCILLA,DOBLE,TRIPLE,CUADRUPLE',
                function ($attribute, $value, $fail) {
                    $tipo = $this->input('tipo', $this->tipo_habitacion->tipo ?? null);
                    if ($tipo === 'ESTANDAR' && !in_array($value, ['SENCILLA', 'DOBLE'])) {
                        $fail('Para tipo ESTANDAR, la acomodación debe ser SENCILLA o DOBLE.');
                    }
                    if ($tipo === 'JUNIOR' && !in_array($value, ['TRIPLE', 'CUADRUPLE'])) {
                        $fail('Para tipo JUNIOR, la acomodación debe ser TRIPLE o CUADRUPLE.');
                    }
                    if ($tipo === 'SUITE' && !in_array($value, ['SENCILLA', 'DOBLE', 'TRIPLE'])) {
                        $fail('Para tipo SUITE, la acomodación debe ser SENCILLA, DOBLE o TRIPLE.');
                    }
                },
            ],
            'cantidad' => 'sometimes|integer|min:1',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $hotel = Hotel::find($this->route('id')); // ID del hotel desde la ruta
            if (!$hotel) {
                $validator->errors()->add('hotel', 'El hotel no existe.');
                return;
            }

            $tipoHabitacionId = $this->route('habitacion'); // ID del tipo de habitación
            $tipoHabitacion = TipoHabitacion::where('hotel_id', $hotel->id)->find($tipoHabitacionId);
            if (!$tipoHabitacion) {
                $validator->errors()->add('habitacion', 'El tipo de habitación no existe o no pertenece al hotel.');
                return;
            }

            // Usa el valor actual de cantidad si no se envía uno nuevo
            $newCantidad = $this->input('cantidad', $tipoHabitacion->cantidad);
            $totalHabitaciones = $hotel->tiposHabitacion()
                ->where('id', '!=', $tipoHabitacion->id) // Excluir el registro actual
                ->sum('cantidad') + $newCantidad;

            if ($totalHabitaciones > $hotel->numero_habitaciones) {
                $validator->errors()->add(
                    'cantidad',
                    "La suma de habitaciones ($totalHabitaciones) excede el máximo permitido ({$hotel->numero_habitaciones})."
                );
            }
        });
    }

    public function messages()
    {
        return [
            'tipo.in' => 'El tipo debe ser ESTANDAR, JUNIOR o SUITE.',
            'acomodacion.in' => 'La acomodación debe ser SENCILLA, DOBLE, TRIPLE o CUADRUPLE.',
            'cantidad.min' => 'La cantidad debe ser mayor a 0.',
        ];
    }
}