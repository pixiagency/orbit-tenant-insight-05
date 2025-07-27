<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('business_phone');
            $table->string('mobile_phone');
            $table->string('job_title');
            $table->string('department');
            $table->string('status');
            $table->string('source_id');
            $table->string('contact_method');
            $table->boolean('email_permission');
            $table->boolean('phone_permission');
            $table->boolean('whatsapp_permission');
            $table->string('company_name');
            $table->string('website');
            $table->string('industry');
            $table->string('company_size');
            $table->string('address');
            $table->foreignId('country_id')->constrained('countries')->onDelete('cascade');
            $table->foreignId('city_id')->constrained('cities')->onDelete('cascade');
            $table->string('state');
            $table->string('zip_code');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->json('tags')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
