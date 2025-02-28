<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Hotel;

class StoreTipoHabitacionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'tipo' => 'required|in:ESTANDAR,JUNIOR,SUITE',
            'acomodacion' => [
                'required',
                'in:SENCILLA,DOBLE,TRIPLE,CUADRUPLE',
                function ($attribute, $value, $fail) {
                    $tipo = $this->input('tipo');
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
            'cantidad' => 'required|integer|min:1',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $hotel = Hotel::find($this->route('id'));
            if (!$hotel) {
                $validator->errors()->add('hotel', 'El hotel no existe.');
                return;
            }

            $totalHabitaciones = $hotel->tiposHabitacion()->sum('cantidad') + $this->input('cantidad');
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
            'tipo.required' => 'El tipo de habitación es obligatorio.',
            'tipo.in' => 'El tipo debe ser ESTANDAR, JUNIOR o SUITE.',
            'acomodacion.required' => 'La acomodación es obligatoria.',
            'cantidad.min' => 'La cantidad debe ser mayor a 0.',
        ];
    }
}
