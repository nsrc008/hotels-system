<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateTiposHabitacionTable extends Migration
{
    public function up()
    {
        // Crear la tabla básica con Schema Builder
        Schema::create('tipos_habitacion', function (Blueprint $table) {
            $table->id(); // SERIAL PRIMARY KEY
            $table->foreignId('hotel_id')->constrained('hoteles')->onDelete('cascade'); // REFERENCES hoteles(id) ON DELETE CASCADE
            $table->string('tipo', 20)->nullable(false); // VARCHAR(20) NOT NULL
            $table->string('acomodacion', 20)->nullable(false); // VARCHAR(20) NOT NULL
            $table->integer('cantidad')->unsigned()->nullable(false); // INTEGER NOT NULL
            $table->unique(['hotel_id', 'tipo', 'acomodacion']); // UNIQUE (hotel_id, tipo, acomodacion)
        });

        // Agregar las restricciones CHECK con SQL
        DB::statement("ALTER TABLE tipos_habitacion ADD CONSTRAINT tipo_check CHECK (tipo IN ('ESTANDAR', 'JUNIOR', 'SUITE'));");
        DB::statement("ALTER TABLE tipos_habitacion ADD CONSTRAINT acomodacion_check CHECK (acomodacion IN ('SENCILLA', 'DOBLE', 'TRIPLE', 'CUADRUPLE'));");
        DB::statement("ALTER TABLE tipos_habitacion ADD CONSTRAINT tipos_habitacion_cantidad_check CHECK (cantidad > 0);");
        DB::statement("
            ALTER TABLE tipos_habitacion 
            ADD CONSTRAINT valid_acomodacion CHECK (
                (tipo = 'ESTANDAR' AND acomodacion IN ('SENCILLA', 'DOBLE')) OR 
                (tipo = 'JUNIOR' AND acomodacion IN ('TRIPLE', 'CUADRUPLE')) OR 
                (tipo = 'SUITE' AND acomodacion IN ('SENCILLA', 'DOBLE', 'TRIPLE'))
            );
        ");
    }

    public function down()
    {
        Schema::dropIfExists('tipos_habitacion');
    }
}