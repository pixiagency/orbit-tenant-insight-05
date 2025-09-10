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
        // Default payment methods (pre-defined)
        PaymentMethod::create([
            'name' => 'Cash',
            'is_enabled' => true,
            'is_default' => true,
            'is_manual_added' => false,
        ]);
        
        PaymentMethod::create([
            'name' => 'Bank Transfer',
            'is_enabled' => true,
            'is_default' => false,
            'is_manual_added' => false,
        ]);
        
        PaymentMethod::create([
            'name' => 'Crypto',
            'is_enabled' => true,
            'is_default' => false,
            'is_manual_added' => false,
        ]);
        
        PaymentMethod::create([
            'name' => 'Card',
            'is_enabled' => true,
            'is_default' => false,
            'is_manual_added' => false,
        ]);
        
        PaymentMethod::create([
            'name' => 'Check',
            'is_enabled' => true,
            'is_default' => false,
            'is_manual_added' => false,
        ]);
        
        PaymentMethod::create([
            'name' => 'Paypal',
            'is_enabled' => true,
            'is_default' => false,
            'is_manual_added' => false,
        ]);
    }
}
