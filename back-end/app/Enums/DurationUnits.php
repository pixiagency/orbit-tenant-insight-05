<?php

namespace App\Enums;

enum DurationUnits: string
{
    case DAYS = 'days';
    case MONTHS = 'months';
    case YEARS = 'years';
    case LIFETIME = 'lifetime';

    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}
