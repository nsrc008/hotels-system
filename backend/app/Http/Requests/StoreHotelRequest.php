<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHotelRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Cambia esto si necesitas lógica de autorización
    }

    public function rules()
    {
        return [
            'nombre' => 'required|string|max:100|unique:hoteles,nombre',
            'direccion' => 'required|string|max:200',
            'ciudad' => 'required|string|max:100',
            'nit' => 'required|string|max:20|unique:hoteles,nit',
            'numero_habitaciones' => 'required|integer|min:1',
        ];
    }

    public function messages()
    {
        return [
            'nombre.required' => 'El nombre del hotel es obligatorio.',
            'direccion.required' => 'La dirección del hotel es obligatoria.',
            'ciudad.required' => 'La ciudad es obligatoria.',
            'nit.required' => 'El NIT es obligatorio.',
            'nit.unique' => 'El NIT ya está registrado en otro hotel.',
            'numero_habitaciones.required' => 'El número de habitaciones es obligatorio.',
            'numero_habitaciones.integer' => 'El número de habitaciones debe ser un valor entero.',
            'numero_habitaciones.min' => 'El número de habitaciones debe ser al menos 1.',
        ];
    }
}
