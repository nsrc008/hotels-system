<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class HotelFactory extends Factory
{
    protected $model = \App\Models\Hotel::class;

    public function definition()
    {
        return [
            'nombre' => $this->faker->company . ' Hotel',
            'direccion' => $this->faker->address,
            'ciudad' => $this->faker->city,
            'nit' => $this->faker->unique()->numerify('########-#'),
            'numero_habitaciones' => $this->faker->numberBetween(10, 100),
        ];
    }
}