<?php

namespace Database\Seeders\tenant;

use App\Models\Tenant\Contact;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Contact::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'business_phone' => '1234567890',
            'mobile_phone' => '1234567890',
            'job_title' => 'Software Engineer',
            'department' => 'IT',
            'status' => 'Active',
            'source_id' => 1,
            'contact_method' => 'Email',
            'email_permission' => 1,
            'phone_permission' => 1,
            'whatsapp_permission' => 1,
            'company_name' => 'Example Inc.',
            'website' => 'https://example.com',
            'industry' => 'Software',
            'company_size' => '100',
            'address' => '123 Main St, Anytown, USA',
            'country_id' => 1,
            'city_id' => 1,
            'state' => 'CA',
            'zip_code' => '12345',
            'user_id' => 1,
            'notes' => 'Notes',
            'tags' => json_encode(['tag1', 'tag2']),
        ]); 
    }
}