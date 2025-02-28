<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHotelRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $hotelId = $this->route('id'); // Obtener el ID del hotel desde la ruta
        return [
            'nombre' => "sometimes|string|max:100|unique:hoteles,nombre,{$hotelId}",
            'direccion' => 'sometimes|string|max:200',
            'ciudad' => 'sometimes|string|max:100',
            'nit' => "sometimes|string|max:20|unique:hoteles,nit,{$hotelId}",
            'numero_habitaciones' => 'sometimes|integer|min:1',
        ];
    }

    public function messages()
    {
        return [
            'nombre.unique' => 'Ya existe un hotel con este nombre.',
            'nit.unique' => 'El NIT ya está registrado.',
            'numero_habitaciones.min' => 'El número de habitaciones debe ser mayor a 0.',
        ];
    }
}
