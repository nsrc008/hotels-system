<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Hotel;

class HotelControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Prueba que la lista de hoteles se devuelva correctamente.
     */
    public function test_index_returns_hotels()
    {
        Hotel::factory()->count(3)->create();

        $response = $this->getJson('/api/hoteles');

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    /**
     * Prueba que se pueda crear un hotel con datos válidos.
     */
    public function test_store_creates_hotel()
    {
        $data = [
            'nombre' => 'Hotel Test',
            'direccion' => 'Calle 123',
            'ciudad' => 'Bogotá',
            'nit' => '12345678-9',
            'numero_habitaciones' => 10,
        ];

        $response = $this->postJson('/api/hoteles', $data);

        $response->assertStatus(201)
                 ->assertJsonFragment(['nombre' => 'Hotel Test']);
        $this->assertDatabaseHas('hoteles', $data);
    }

    /**
     * Prueba que no se pueda crear un hotel con NIT duplicado.
     */
    public function test_store_fails_with_duplicate_nit()
    {
        Hotel::factory()->create(['nit' => '12345678-9']);

        $data = [
            'nombre' => 'Hotel Test',
            'direccion' => 'Calle 123',
            'ciudad' => 'Bogotá',
            'nit' => '12345678-9',
            'numero_habitaciones' => 10,
        ];

        $response = $this->postJson('/api/hoteles', $data);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['nit']);
    }

    /**
     * Prueba que se pueda obtener un hotel por ID.
     */
    public function test_show_returns_hotel()
    {
        $hotel = Hotel::factory()->create();

        $response = $this->getJson("/api/hoteles/{$hotel->id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['nombre' => $hotel->nombre]);
    }

    /**
     * Prueba que se pueda actualizar un hotel.
     */
    public function test_update_modifies_hotel()
    {
        $hotel = Hotel::factory()->create();

        $data = ['nombre' => 'Hotel Actualizado'];
        $response = $this->putJson("/api/hoteles/{$hotel->id}", $data);

        $response->assertStatus(200)
                 ->assertJsonFragment(['nombre' => 'Hotel Actualizado']);
        $this->assertDatabaseHas('hoteles', ['id' => $hotel->id, 'nombre' => 'Hotel Actualizado']);
    }

    /**
     * Prueba que se pueda eliminar un hotel.
     */
    public function test_destroy_deletes_hotel()
    {
        $hotel = Hotel::factory()->create();

        $response = $this->deleteJson("/api/hoteles/{$hotel->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('hoteles', ['id' => $hotel->id]);
    }
}