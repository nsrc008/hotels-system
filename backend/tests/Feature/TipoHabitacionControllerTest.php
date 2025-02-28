<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Hotel;
use App\Models\TipoHabitacion;

class TipoHabitacionControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_creates_tipo_habitacion()
    {
        $hotel = Hotel::factory()->create(['numero_habitaciones' => 50]);

        $data = [
            'tipo' => 'ESTANDAR',
            'acomodacion' => 'SENCILLA',
            'cantidad' => 25,
        ];

        $response = $this->postJson("/api/hoteles/{$hotel->id}/habitaciones", $data);

        $response->assertStatus(201)
                 ->assertJsonFragment($data);
        $this->assertDatabaseHas('tipos_habitacion', array_merge($data, ['hotel_id' => $hotel->id]));
    }

    public function test_store_fails_if_exceeds_max_habitaciones()
    {
        $hotel = Hotel::factory()->create(['numero_habitaciones' => 20]);
        TipoHabitacion::factory()->create([
            'hotel_id' => $hotel->id,
            'tipo' => 'ESTANDAR',
            'acomodacion' => 'SENCILLA',
            'cantidad' => 15,
        ]);

        $data = [
            'tipo' => 'ESTANDAR',
            'acomodacion' => 'DOBLE',
            'cantidad' => 10, // 15 + 10 > 20
        ];

        $response = $this->postJson("/api/hoteles/{$hotel->id}/habitaciones", $data);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['cantidad']);
    }

    public function test_update_modifies_tipo_habitacion()
    {
        $hotel = Hotel::factory()->create(['numero_habitaciones' => 50]);
        $tipoHabitacion = TipoHabitacion::factory()->create([
            'hotel_id' => $hotel->id,
            'tipo' => 'ESTANDAR',
            'acomodacion' => 'SENCILLA',
            'cantidad' => 10,
        ]);

        $data = ['cantidad' => 20];
        $response = $this->putJson("/api/hoteles/{$hotel->id}/habitaciones/{$tipoHabitacion->id}", $data);

        $response->assertStatus(200)
                 ->assertJsonFragment(['cantidad' => 20]);
        $this->assertDatabaseHas('tipos_habitacion', ['id' => $tipoHabitacion->id, 'cantidad' => 20]);
    }

    public function test_destroy_deletes_tipo_habitacion()
    {
        $hotel = Hotel::factory()->create();
        $tipoHabitacion = TipoHabitacion::factory()->create([
            'hotel_id' => $hotel->id,
            'tipo' => 'ESTANDAR',
            'acomodacion' => 'SENCILLA',
        ]);

        $response = $this->deleteJson("/api/hoteles/{$hotel->id}/habitaciones/{$tipoHabitacion->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('tipos_habitacion', ['id' => $tipoHabitacion->id]);
    }
}