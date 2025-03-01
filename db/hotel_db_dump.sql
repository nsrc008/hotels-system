CREATE TABLE hoteles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    nit VARCHAR(20) UNIQUE NOT NULL,
    numero_habitaciones INTEGER NOT NULL CHECK (numero_habitaciones > 0)
);

CREATE TABLE tipos_habitacion (
    id SERIAL PRIMARY KEY,
    hotel_id INTEGER REFERENCES hoteles(id) ON DELETE CASCADE,
    tipo VARCHAR(20) CHECK (tipo IN ('ESTANDAR', 'JUNIOR', 'SUITE')) NOT NULL,
    acomodacion VARCHAR(20) CHECK (acomodacion IN ('SENCILLA', 'DOBLE', 'TRIPLE', 'CUADRUPLE')) NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    CONSTRAINT valid_acomodacion CHECK (
        (tipo = 'ESTANDAR' AND acomodacion IN ('SENCILLA', 'DOBLE')) OR
        (tipo = 'JUNIOR' AND acomodacion IN ('TRIPLE', 'CUADRUPLE')) OR
        (tipo = 'SUITE' AND acomodacion IN ('SENCILLA', 'DOBLE', 'TRIPLE'))
    ),
    UNIQUE (hotel_id, tipo, acomodacion)
);

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

CREATE TRIGGER trigger_check_habitaciones
    BEFORE INSERT OR UPDATE ON tipos_habitacion
    FOR EACH ROW EXECUTE FUNCTION check_habitaciones_max();