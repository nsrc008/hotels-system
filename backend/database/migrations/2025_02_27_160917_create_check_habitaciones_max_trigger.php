<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateCheckHabitacionesMaxTrigger extends Migration
{
    public function up()
    {
        // Crear la función
        DB::statement("
            CREATE OR REPLACE FUNCTION check_habitaciones_max() RETURNS TRIGGER AS \$\$
            DECLARE
                total_habitaciones INTEGER;
                max_habitaciones INTEGER;
            BEGIN
                -- Calcular la suma de habitaciones asignadas al hotel
                SELECT SUM(cantidad) INTO total_habitaciones 
                FROM tipos_habitacion 
                WHERE hotel_id = NEW.hotel_id;

                -- Si es INSERT, sumar NEW.cantidad; si es UPDATE, restar el valor anterior y sumar el nuevo
                IF TG_OP = 'INSERT' THEN
                    total_habitaciones := COALESCE(total_habitaciones, 0) + NEW.cantidad;
                ELSIF TG_OP = 'UPDATE' THEN
                    total_habitaciones := COALESCE(total_habitaciones, 0) - OLD.cantidad + NEW.cantidad;
                END IF;

                -- Obtener el máximo permitido
                SELECT numero_habitaciones INTO max_habitaciones 
                FROM hoteles 
                WHERE id = NEW.hotel_id;

                -- Validar
                IF total_habitaciones > max_habitaciones THEN
                    RAISE EXCEPTION 'La suma de habitaciones (%) excede el máximo permitido (%) para el hotel', total_habitaciones, max_habitaciones;
                END IF;
                RETURN NEW;
            END;
            \$\$ LANGUAGE plpgsql;
        ");

        // Crear el trigger
        DB::statement("
            CREATE TRIGGER trigger_check_habitaciones
            BEFORE INSERT OR UPDATE ON tipos_habitacion
            FOR EACH ROW EXECUTE FUNCTION check_habitaciones_max();
        ");
    }

    public function down()
    {
        // Eliminar el trigger
        DB::statement("DROP TRIGGER IF EXISTS trigger_check_habitaciones ON tipos_habitacion;");
        // Eliminar la función
        DB::statement("DROP FUNCTION IF EXISTS check_habitaciones_max();");
    }
}