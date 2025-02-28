<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\TipoHabitacionController;

Route::get('/hoteles', [HotelController::class, 'index']);            // Listar hoteles
Route::post('/hoteles', [HotelController::class, 'store']);           // Crear hotel
Route::get('/hoteles/{id}', [HotelController::class, 'show']);        // Detalle del hotel
Route::put('/hoteles/{id}', [HotelController::class, 'update']);      // Actualizar hotel
Route::delete('/hoteles/{id}', [HotelController::class, 'destroy']);  // Eliminar hotel

Route::post('/hoteles/{id}/habitaciones', [TipoHabitacionController::class, 'store']);          // Crear tipo de habitación
Route::put('/hoteles/{id}/habitaciones/{habitacion}', [TipoHabitacionController::class, 'update']);  // Actualizar tipo de habitación
Route::delete('/hoteles/{id}/habitaciones/{habitacion}', [TipoHabitacionController::class, 'destroy']); // Eliminar tipo de habitación