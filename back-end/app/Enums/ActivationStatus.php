<?php

namespace App\Enums;

enum ActivationStatus: string
{
    case ACTIVE = "active";
    case INACTIVE = "inactive";

    public function label(): string
    {
        return match ($this) {
            self::ACTIVE => "Active",
            self::INACTIVE => "Inactive",
        };
    }

    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}



