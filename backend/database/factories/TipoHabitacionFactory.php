<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TipoHabitacionFactory extends Factory
{
    protected $model = \App\Models\TipoHabitacion::class;

    public function definition()
    {
        $tipo = $this->faker->randomElement(['ESTANDAR', 'JUNIOR', 'SUITE']);
        $acomodacion = $this->getValidAcomodacion($tipo);

        return [
            'hotel_id' => \App\Models\Hotel::factory(),
            'tipo' => $tipo,
            'acomodacion' => $acomodacion,
            'cantidad' => $this->faker->numberBetween(1, 50),
        ];
    }

    private function getValidAcomodacion($tipo)
    {
        $validAcomodaciones = [
            'ESTANDAR' => ['SENCILLA', 'DOBLE'],
            'JUNIOR' => ['TRIPLE', 'CUADRUPLE'],
            'SUITE' => ['SENCILLA', 'DOBLE', 'TRIPLE'],
        ];

        return $this->faker->randomElement($validAcomodaciones[$tipo]);
    }
}