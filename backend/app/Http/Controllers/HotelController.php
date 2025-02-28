<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHotelRequest;
use App\Http\Requests\UpdateHotelRequest;
use App\Repositories\HotelRepositoryInterface;

class HotelController extends Controller
{
    protected $hotelRepository;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param HotelRepositoryInterface $hotelRepository
     */
    public function __construct(HotelRepositoryInterface $hotelRepository)
    {
        $this->hotelRepository = $hotelRepository;
    }

    public function index()
    {
        return response()->json($this->hotelRepository->all());
    }

    public function store(StoreHotelRequest $request)
    {
        $hotel = $this->hotelRepository->create($request->validated());
        return response()->json($hotel, 201);
    }

    public function show($id)
    {
        return response()->json($this->hotelRepository->find($id));
    }

    public function update(UpdateHotelRequest $request, $id)
    {
        $hotel = $this->hotelRepository->update($id, $request->validated());
        return response()->json($hotel);
    }

    public function destroy($id)
    {
        $this->hotelRepository->delete($id);
        return response()->json(null, 204);
    }
}
