<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\HotelRepository;
use App\Repositories\HotelRepositoryInterface;
use App\Repositories\TipoHabitacionRepository;
use App\Repositories\TipoHabitacionRepositoryInterface;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(HotelRepositoryInterface::class, HotelRepository::class);
        $this->app->bind(TipoHabitacionRepositoryInterface::class, TipoHabitacionRepository::class);
    }

    public function boot()
    {
        //
    }
}
