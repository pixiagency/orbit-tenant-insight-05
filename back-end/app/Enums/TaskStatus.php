<?php

namespace App\Enums;

enum TaskStatus: string
{
    case PENDING = 'pending';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';


    public function label(): string
    {
        return match ($this) {
            static::PENDING => 'Pending',
            static::IN_PROGRESS => 'In progress',
            static::COMPLETED => 'Completed',
            static::CANCELLED => 'Cancelled',
        };
    }

    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}
