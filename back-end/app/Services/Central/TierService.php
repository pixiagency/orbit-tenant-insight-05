<?php

namespace App\Services\Central;

use App\Models\Tenant;
use App\Models\User;
use App\Services\BaseService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class TierService extends BaseService
{
    public function __construct(public User $model) {}

    public function getModel(): Model
    {
        return $this->model;
    }

    public function store(string $name, string $tenant, string $email, string $password): bool
    {
        $user = $this->getModel()->create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
        ]);
        $tenant_record = Tenant::create([
            'id' => $tenant,
            'tenancy_db_name' => "billiqa_" . $tenant,
            'name' => $tenant,
            'user_id' => $user->id
        ]);
        $tenant_record->domains()->create([
            'domain' => $tenant,
        ]);
        return true;
    }


}
