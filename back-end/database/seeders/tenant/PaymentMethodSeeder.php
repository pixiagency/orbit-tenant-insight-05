<?php

namespace Database\Seeders\tenant;

use App\Models\Tenant\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PaymentMethod::create([
            'name' => 'Cash',
        ]);
        PaymentMethod::create([
            'name' => 'Bank Transfer',
        ]);
        PaymentMethod::create([
            'name' => 'Credit Card',
        ]);
        PaymentMethod::create([
            'name' => 'Paypal',
        ]);
    }
}
