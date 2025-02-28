<?php

namespace App\Repositories;

use App\Models\Hotel;

interface HotelRepositoryInterface
{
    public function all();
    public function find($id);
    public function create(array $data): Hotel;
    public function update($id, array $data): Hotel;
    public function delete($id);
}
