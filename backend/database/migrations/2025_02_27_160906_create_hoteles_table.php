<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateHotelesTable extends Migration
{
    public function up()
    {
        Schema::create('hoteles', function (Blueprint $table) {
            $table->id(); // SERIAL PRIMARY KEY
            $table->string('nombre', 100)->unique()->nullable(false); // VARCHAR(100) UNIQUE NOT NULL
            $table->string('direccion', 200)->nullable(false); // VARCHAR(200) NOT NULL
            $table->string('ciudad', 100)->nullable(false); // VARCHAR(100) NOT NULL
            $table->string('nit', 20)->unique()->nullable(false); // VARCHAR(20) UNIQUE NOT NULL
            $table->integer('numero_habitaciones')->unsigned()->nullable(false); // INTEGER NOT NULL
        });

        // Agregar el CHECK con SQL
        DB::statement("ALTER TABLE hoteles ADD CONSTRAINT hoteles_numero_habitaciones_check CHECK (numero_habitaciones > 0);");
    }

    public function down()
    {
        Schema::dropIfExists('hoteles');
    }
}