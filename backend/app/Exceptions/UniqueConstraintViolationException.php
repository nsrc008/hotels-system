<?php

namespace App\Exceptions;

use Exception;

class UniqueConstraintViolationException extends Exception
{
    public function __construct(string $message = "Violación de restricción única", int $code = 422)
    {
        parent::__construct($message, $code);
    }
}