<?php

namespace App\Enums;

enum RolesEnum: string
{
    case SALES = 'sales';
    case LEADER = 'leader';
    case ADMIN = 'admin';
    case SUPERADMIN = 'super-admin';


    public function label(): string
    {
        return match ($this) {
            static::SALES => 'Sales',
            static::LEADER => 'Leader',
            static::ADMIN => 'Admin',
            static::SUPERADMIN => 'Super Admin',
        };
    }
}
