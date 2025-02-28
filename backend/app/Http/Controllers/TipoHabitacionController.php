<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTipoHabitacionRequest;
use App\Http\Requests\UpdateTipoHabitacionRequest;
use App\Repositories\TipoHabitacionRepositoryInterface;
use App\Exceptions\UniqueConstraintViolationException;
use Exception;

class TipoHabitacionController extends Controller
{
    protected $tipoHabitacionRepository;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param TipoHabitacionRepositoryInterface $tipoHabitacionRepository
     */
    public function __construct(TipoHabitacionRepositoryInterface $tipoHabitacionRepository)
    {
        $this->tipoHabitacionRepository = $tipoHabitacionRepository;
    }

    public function store(StoreTipoHabitacionRequest $request, $id)
    {
        try {
            $tipoHabitacion = $this->tipoHabitacionRepository->create($id, $request->validated());
            return response()->json($tipoHabitacion, 201);
        } catch (UniqueConstraintViolationException $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode());
        } catch (Exception $e) {
            return response()->json(['message' => 'Error al guardar el tipo de habitación'], 500);
        }
    }

    public function update(UpdateTipoHabitacionRequest $request, $id, $habitacion)
    {
        $tipoHabitacion = $this->tipoHabitacionRepository->update($id, $habitacion, $request->validated());
        return response()->json($tipoHabitacion);
    }

    public function destroy($id, $habitacion)
    {
        $this->tipoHabitacionRepository->delete($id, $habitacion);
        return response()->json(null, 204);
    }
}
